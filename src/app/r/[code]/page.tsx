import { redirect } from "next/navigation";

export default function ReferralRedirect({ params }: { params: { code: string } }) {
  redirect(`/?ref=${params.code}`);
}
