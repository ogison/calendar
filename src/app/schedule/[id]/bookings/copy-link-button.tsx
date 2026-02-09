'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export function CopyLinkButton({ scheduleId }: { scheduleId: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/schedule/${scheduleId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          コピー済
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          コピー
        </>
      )}
    </Button>
  );
}
