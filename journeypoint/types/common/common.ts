export type ActionResult<T = void> = {
    success: boolean;
    data?: T;
    error?: string;
};
