import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitContactMessage } from '@/lib/apiClient';

const BUDGETS = ['Under $5k', '$5k – $15k', '$15k – $50k', '$50k+', 'Not sure yet'];

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      toast.error('Please fill in your name and a message.');
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name,
        email,
        company: company || undefined,
        phone: phone || undefined,
        budget: budget || undefined,
        message,
      });

      setSuccess(true);
      toast.success('Message sent!', {
        duration: 6000,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
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
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Message received.</h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
          Thanks, {name.split(' ')[0]}. We read every message ourselves — expect a reply within one business day.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          variant="outline"
          className="rounded-none border-foreground px-8"
        >
          Send Another
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
            <label htmlFor="ct-name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="ct-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Lee"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="ct-email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="ct-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
              required
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="ct-company" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Company <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
            </label>
            <Input
              id="ct-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="ct-phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Phone <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
            </label>
            <Input
              id="ct-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-6">
          Budget <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(budget === b ? '' : b)}
              className={`px-4 py-2 text-sm font-medium border transition-all duration-200 ${
                budget === b
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="ct-message" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Message <span className="text-destructive">*</span>
        </label>
        <Textarea
          id="ct-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you trying to build or fix?"
          className="bg-transparent border border-border rounded-none p-3 focus-visible:ring-0 focus-visible:border-foreground text-base min-h-[140px] resize-none"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] rounded-none py-6 text-sm uppercase tracking-widest font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
