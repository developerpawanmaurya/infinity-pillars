import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitReferral } from '@/lib/apiClient';

const ReferralForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendCompany, setFriendCompany] = useState('');
  const [note, setNote] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!referrerName.trim() || !friendName.trim() || !friendCompany.trim()) {
      toast.error('Please fill in your name, their name, and their company.');
      return;
    }
    if (!emailRegex.test(referrerEmail)) {
      toast.error('Please provide a valid email address for yourself.');
      return;
    }
    if (friendEmail && !emailRegex.test(friendEmail)) {
      toast.error("That doesn't look like a valid email for your referral.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReferral({
        referrerName,
        referrerEmail,
        referrerPhone: referrerPhone || undefined,
        friendName,
        friendEmail: friendEmail || undefined,
        friendCompany,
        note: note || undefined,
      });

      setSuccess(true);
      toast.success('Referral submitted!', {
        duration: 6000,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
    } catch (error) {
      console.error('Referral error:', error);
      toast.error('Failed to submit referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="border border-border bg-muted/20 p-10 md:p-14 text-center">
        <div className="w-16 h-16 border border-[#AFEA00] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-[#AFEA00]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Referral received.</h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
          Thanks, {referrerName.split(' ')[0]}. We'll reach out to {friendName} within 2 business days. You'll hear from us the moment there's an update.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          variant="outline"
          className="rounded-none border-foreground px-8"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border bg-background p-8 md:p-14 space-y-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-6">About You</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label htmlFor="ref-name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="ref-name"
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              placeholder="Alex Rivera"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="ref-email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Your Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="ref-email"
              type="email"
              value={referrerEmail}
              onChange={(e) => setReferrerEmail(e.target.value)}
              placeholder="alex@example.com"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
        </div>
        <div className="space-y-3 mt-6 sm:max-w-[calc(50%-0.75rem)]">
          <label htmlFor="ref-phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your Phone <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
          </label>
          <Input
            id="ref-phone"
            type="tel"
            value={referrerPhone}
            onChange={(e) => setReferrerPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-6">Who You're Referring</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label htmlFor="ref-friend-name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Their Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="ref-friend-name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Sam Torres"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="ref-friend-company" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Their Company <span className="text-destructive">*</span>
            </label>
            <Input
              id="ref-friend-company"
              value={friendCompany}
              onChange={(e) => setFriendCompany(e.target.value)}
              placeholder="Acme Roofing Co."
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
        </div>
        <div className="space-y-3 mt-6 sm:max-w-[calc(50%-0.75rem)]">
          <label htmlFor="ref-friend-email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Their Email <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
          </label>
          <Input
            id="ref-friend-email"
            type="email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            placeholder="sam@acmeroofing.com"
            className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
          />
        </div>
        <div className="space-y-3 mt-6">
          <label htmlFor="ref-note" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Context <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
          </label>
          <Textarea
            id="ref-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What are they looking for? How do you know them?"
            className="bg-transparent border border-border rounded-none p-3 focus-visible:ring-0 focus-visible:border-foreground text-base min-h-[100px] resize-none"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] rounded-none py-6 text-sm uppercase tracking-widest font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Referral'
        )}
      </Button>
    </form>
  );
};

export default ReferralForm;
