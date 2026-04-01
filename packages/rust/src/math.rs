pub fn safe_add(a: i128, b: i128) -> i128 { a.checked_add(b).expect(" math: addition overflow\) }
pub fn safe_sub(a: i128, b: i128) -> i128 { a.checked_sub(b).expect(\math: subtraction underflow\) }
pub fn safe_mul(a: i128, b: i128) -> i128 { a.checked_mul(b).expect(\math: multiplication overflow\) }
pub fn safe_div(a: i128, b: i128) -> i128 { if b == 0 { panic!(\math: division by zero\) } a / b }
pub fn basis_points(amount: i128, bps: i128) -> i128 { safe_div(safe_mul(amount, bps), 10_000) }
pub fn clamp(value: i128, min: i128, max: i128) -> i128 { if value < min { min } else if value > max { max } else { value } }

#[cfg(test)]
mod tests {
 use super::*;
 #[test] fn test_add() { assert_eq!(safe_add(10, 20), 30); }
 #[test] fn test_bps() { assert_eq!(basis_points(1000, 500), 50); }
 #[test] fn test_clamp() { assert_eq!(clamp(15, 1, 10), 10); }
 #[test] #[should_panic] fn test_div_zero() { safe_div(10, 0); }
}
