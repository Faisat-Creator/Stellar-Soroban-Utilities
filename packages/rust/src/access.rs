use soroban_sdk::{Address, Env, Symbol, symbol_short};
const ADMIN_KEY: Symbol = symbol_short!(\ADMIN\);
pub fn set_admin(env: &Env, admin: &Address) { env.storage().instance().set(&ADMIN_KEY, admin); }
pub fn get_admin(env: &Env) -> Address { env.storage().instance().get(&ADMIN_KEY).unwrap() }
pub fn require_admin(env: &Env, caller: &Address) { if get_admin(env) != *caller { panic!(\unauthorized\) } caller.require_auth(); }
pub fn is_admin(env: &Env, address: &Address) -> bool { get_admin(env) == *address }
