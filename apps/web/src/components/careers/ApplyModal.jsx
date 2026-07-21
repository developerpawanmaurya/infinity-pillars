import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { submitApplication } from '@/lib/apiClient';

const ApplyModal = ({ open, onOpenChange, role }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        setSuccess(false);
        setName('');
        setEmail('');
        setPhone('');
        setPortfolioUrl('');
        setLinkedinUrl('');
        setCoverNote('');
      }, 300);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please provide your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitApplication({
        name,
        email,
        phone: phone || undefined,
        roleTitle: role?.title || 'General Application',
        department: role?.department,
        portfolioUrl: portfolioUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        coverNote: coverNote || undefined,
      });

      setSuccess(true);
      toast.success('Application submitted!', {
        duration: 6000,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      });
    } catch (error) {
      console.error('Application error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 rounded-none border-border overflow-hidden bg-background max-h-[90vh] overflow-y-auto">
        <div className="p-8 md:p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tighter">
              {success ? 'Application In.' : role?.title || 'General Application'}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              {success
                ? "We've received it — check your inbox for confirmation. Our team reviews every application personally."
                : role
                  ? `${role.department} · ${role.type} · ${role.location}`
                  : "Don't see the right role? Tell us what you'd bring to the team."}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center border border-border bg-muted/20">
              <div className="w-16 h-16 border border-[#AFEA00] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#AFEA00]" />
              </div>
              <p className="text-muted-foreground max-w-[320px] mb-8 leading-relaxed">
                Thank you, {name.split(' ')[0]}. If it's a fit, we'll reach out within 5 business days to schedule an intro call.
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-none px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="apply-name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="apply-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Lee"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="apply-email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="apply-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="apply-phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Phone <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
                  </label>
                  <Input
                    id="apply-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="apply-linkedin" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    LinkedIn
                  </label>
                  <Input
                    id="apply-linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="linkedin.com/in/you"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="apply-portfolio" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Portfolio / Resume Link
                </label>
                <Input
                  id="apply-portfolio"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="Link to your portfolio, GitHub, or resume"
                  className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="apply-note" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Why You
                </label>
                <Textarea
                  id="apply-note"
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="A couple of sentences on what you'd bring to the team..."
                  className="bg-transparent border border-border rounded-none p-3 focus-visible:ring-0 focus-visible:border-foreground text-base min-h-[100px] resize-none"
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
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyModal;
