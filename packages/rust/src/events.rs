use soroban_sdk::{Address, Env, Symbol};
pub fn emit_transfer(env: &Env, from: &Address, to: &Address, amount: i128) {
 env.events().publish((Symbol::new(env, \transfer\), from.clone(), to.clone()), amount);
}
pub fn emit_approval(env: &Env, owner: &Address, spender: &Address, amount: i128) {
 env.events().publish((Symbol::new(env, \approval\), owner.clone(), spender.clone()), amount);
}
pub fn emit_action(env: &Env, action: &str, value: i128) {
 env.events().publish((Symbol::new(env, action),), value);
}
