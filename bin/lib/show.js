import matter from 'gray-matter';

function colorize(enabled, open, close, value) {
  return enabled ? `${open}${value}${close}` : value;
}

export function useColor(stream = process.stdout) {
  return Boolean(stream.isTTY) && !process.env.NO_COLOR;
}

export function compactArtifact(text, { color = false } = {}) {
  const parsed = matter(text);
  const lines = parsed.content.trim().split('\n');
  const output = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const fence = line.match(/^```(\S+)?\s*$/);
    if (fence) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        const label = fence[1] || '';
        if (label) {
          output.push(colorize(color, '\u001b[90m', '\u001b[0m', label));
        }
      } else {
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      output.push(colorize(color, '\u001b[38;5;250m', '\u001b[0m', `  ${line}`));
      continue;
    }

    if (/^#{1,6}\s+/.test(line)) {
      const heading = line.replace(/^#{1,6}\s+/, '');
      output.push(colorize(color, '\u001b[36m', '\u001b[0m', heading));
      continue;
    }

    output.push(line);
  }

  return `${output.join('\n')}\n`;
}

export function printArtifacts(artifacts, { raw = false, color = false } = {}) {
  for (let index = 0; index < artifacts.length; index++) {
    const artifact = artifacts[index];
    const output = raw ? artifact.text : compactArtifact(artifact.text, { color });
    process.stdout.write(output);
    if (index < artifacts.length - 1) process.stdout.write('\n---\n');
  }
}
