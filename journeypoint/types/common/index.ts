export interface IActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}
