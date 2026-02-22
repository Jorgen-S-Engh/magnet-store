declare module "@hookform/resolvers/zod" {
  import { z } from "zod";
  export function zodResolver<T extends z.ZodType>(schema: T): import("react-hook-form").Resolver<z.infer<T>>;
}
