pub fn require_positive(amount: i128) { if amount <= 0 { panic!(\validation: amount must be positive\) } }
pub fn require_max(amount: i128, max: i128) { if amount > max { panic!(\validation: amount exceeds maximum\) } }
pub fn require_not_expired(current_ledger: u32, deadline: u32) { if current_ledger > deadline { panic!(\validation: deadline has passed\) } }

#[cfg(test)]
mod tests {
 use super::*;
 #[test] fn test_positive() { require_positive(1); }
 #[test] #[should_panic] fn test_zero() { require_positive(0); }
 #[test] fn test_not_expired() { require_not_expired(10, 20); }
 #[test] #[should_panic] fn test_expired() { require_not_expired(25, 20); }
}
