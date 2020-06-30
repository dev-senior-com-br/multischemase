export interface Resolver<T, K> {
    resolve(params: K): T;
}