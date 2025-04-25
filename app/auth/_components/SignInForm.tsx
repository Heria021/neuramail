// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// const signInSchema = z.object({
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// export default function SignInForm() {
//     const router = useRouter();
//     const signInForm = useForm<z.infer<typeof signInSchema>>({
//         resolver: zodResolver(signInSchema),
//         defaultValues: {
//             email: "",
//             password: "",
//         },
//     });

//     const handleSignIn: SubmitHandler<FieldValues> = async (data) => {
//         try {
//             const response = await signIn(data.email, data.password);
//             if (response.status === true) {
//                 toast.success("Success!", {
//                     description: response.message || "Login Successfully",
//                 });

//                 localStorage.setItem("access_token", response.access_token);
//                 localStorage.setItem("user_email", data.email);
//                 localStorage.setItem("login_id", response.login_id);
//                 router.push("/overview");
//             } else {
//                 toast.error("Error!", {
//                     description: response.message || "Something went wrong",
//                 });
//             }
//         } catch (error) {
//             console.error("Failed to sign in:", error);
//             toast("Error!", {
//                 description: "An error occurred. Please try again later.",
//             });
//         }
//     };

//     return (
//         <Form {...signInForm}>
//             <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="grid gap-4">
//                 <FormField
//                     control={signInForm.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Email</FormLabel>
//                             <FormControl>
//                                 <Input {...field} placeholder="Email" />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={signInForm.control}
//                     name="password"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Password</FormLabel>
//                             <FormControl>
//                                 <Input {...field} type="password" placeholder="Password" />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <Button type="submit" className="mt-4 rounded-xl">
//                     Sign In
//                 </Button>
//             </form>
//         </Form>
//     );
// }