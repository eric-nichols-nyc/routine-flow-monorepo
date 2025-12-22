import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Shield } from "lucide-react";

export default function Page() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Security Lab</CardTitle>
          <CardDescription>
            A sandbox for security testing and experimentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground text-sm">
            This is a bare-bones Next.js 16 app ready for security experiments.
          </p>
          <div className="flex justify-center">
            <Button>Get Started</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
