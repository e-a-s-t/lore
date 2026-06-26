use std::{fmt, str::FromStr};

use serde::{Deserialize, Serialize};

#[derive(
    Debug,
    Copy,
    Clone,
    Eq,
    PartialEq,
    Ord,
    PartialOrd,
    Serialize,
    Deserialize,
    Default,
)]
pub enum Status {
    #[default]
    Draft,
    Proposed,
    Accepted,
    Implemented,
    Verified,
    Rejected,
    Deprecated,
}

impl Status {
    pub const ALL: [Status; 7] = [
        Status::Draft,
        Status::Proposed,
        Status::Accepted,
        Status::Implemented,
        Status::Verified,
        Status::Rejected,
        Status::Deprecated,
    ];

    pub fn as_str(self) -> &'static str {
        match self {
            Status::Draft => "Draft",
            Status::Proposed => "Proposed",
            Status::Accepted => "Accepted",
            Status::Implemented => "Implemented",
            Status::Verified => "Verified",
            Status::Rejected => "Rejected",
            Status::Deprecated => "Deprecated",
        }
    }
}

impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl FromStr for Status {
    type Err = String;

    fn from_str(input: &str) -> Result<Self, Self::Err> {
        match input {
            "Draft" => Ok(Status::Draft),
            "Proposed" => Ok(Status::Proposed),
            "Accepted" => Ok(Status::Accepted),
            "Implemented" => Ok(Status::Implemented),
            "Verified" => Ok(Status::Verified),
            "Rejected" => Ok(Status::Rejected),
            "Deprecated" => Ok(Status::Deprecated),
            _ => Err(format!(
                "invalid status `{input}`. Allowed: {}",
                Status::ALL
                    .iter()
                    .map(|status| status.to_string())
                    .collect::<Vec<_>>()
                    .join(", ")
            )),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn status_all_is_in_lifecycle_order() {
        assert_eq!(
            Status::ALL,
            [
                Status::Draft,
                Status::Proposed,
                Status::Accepted,
                Status::Implemented,
                Status::Verified,
                Status::Rejected,
                Status::Deprecated,
            ]
        );
    }

    #[test]
    fn status_round_trips_through_display_and_parse() {
        for status in Status::ALL {
            let text = status.to_string();
            assert_eq!(text.parse::<Status>().unwrap(), status);
        }
    }

    #[test]
    fn status_parse_error_lists_allowed_values() {
        let error = "Broken".parse::<Status>().unwrap_err();
        assert!(error.contains("invalid status `Broken`"), "{error}");
        assert!(error.contains("Draft"), "{error}");
        assert!(error.contains("Deprecated"), "{error}");
    }
}
