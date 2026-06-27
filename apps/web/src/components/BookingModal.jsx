import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBooking } from '@/lib/apiClient';
import { cn } from '@/lib/utils';

const availableServices = [
  'SEO',
  'PPC Advertising',
  'Social Media Marketing',
  'Content Marketing',
  'Email Marketing Automation'
];

const BookingModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Sync modal state with URL hash and fetch location when modal opens
  useEffect(() => {
    const isBooking = location.hash === '#booking';
    setIsOpen(isBooking);

    if (isBooking && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
            );
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const country = data.address?.country || '';
            setUserLocation([city, country].filter(Boolean).join(', '));
          } catch {
            setUserLocation(null);
          }
        },
        () => setUserLocation(null)
      );
    }
  }, [location.hash]);

  const handleOpenChange = (open) => {
    if (!open) {
      // Remove hash without adding to history stack
      navigate(location.pathname + location.search, { replace: true });
      
      // Reset form on close after a small delay to allow exit animation
      setTimeout(() => {
        setSuccess(false);
        setName('');
        setEmail('');
        setCompany('');
        setPhone('');
        setSelectedServices([]);
        setAdditionalInfo('');
        setDate(null);
        setTime('');
        setUserLocation(null);
      }, 300);
    } else {
      window.location.hash = 'booking';
    }
  };

  const handleServiceToggle = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !company.trim()) {
      toast.error('Please provide your name and company.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error('Please provide a valid email address.');
      return;
    }

    if (selectedServices.length === 0) {
      toast.error('Please select at least one service.');
      return;
    }

    setIsSubmitting(true);

    try {
      let isoDate = '';
      let formattedDateTime = 'Not specified';
      
      if (date) {
        const d = new Date(date);
        if (time) {
          const [hours, minutes] = time.split(':');
          d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        }
        isoDate = d.toISOString();
        formattedDateTime = format(d, time ? 'PPP p' : 'PPP');
      }

      await createBooking({
        name,
        email,
        company,
        phone: phone || undefined,
        selectedServices,
        additionalInfo,
        bookedDateTime: isoDate || undefined,
        location: userLocation || undefined,
      });

      setSuccess(true);
      
      // Detailed success toast with custom UI
      toast.success('Consultation booked successfully!', {
        duration: 7000,
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        className: "bg-green-50 border-green-200 text-green-900",
        description: (
          <div className="mt-2 space-y-1.5 text-sm text-green-800/90">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Company:</strong> {company}</p>
            <p><strong>Services:</strong> {selectedServices.join(', ')}</p>
            <p><strong>Date:</strong> {formattedDateTime}</p>
          </div>
        )
      });
      
      // Auto close after 7 seconds
      setTimeout(() => {
        handleOpenChange(false);
      }, 7000);

    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-none border-border overflow-hidden bg-background max-h-[90vh] overflow-y-auto">
        <div className="p-8 md:p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tighter">
              {success ? 'Booking Confirmed.' : 'Let\'s talk growth.'}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              {success 
                ? 'We have received your request and will be in touch shortly to confirm the details.' 
                : 'Select the services you\'re interested in and provide a few details to schedule your consultation.'}
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 bg-green-50/50 border border-green-100 rounded-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-950">Request Received</h3>
              <p className="text-green-800/80 max-w-[320px] mb-8 leading-relaxed">
                Thank you, {name.split(' ')[0]}! Check your inbox at <strong>{email}</strong>. We've sent a confirmation email with next steps.
              </p>
              <Button 
                onClick={() => handleOpenChange(false)}
                className="bg-green-600 text-white hover:bg-green-700 rounded-full px-8"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maya Chen"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10 text-foreground placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10 text-foreground placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label htmlFor="company" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Company <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10 text-foreground placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Phone <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground text-base h-10 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Services of Interest <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 border border-border">
                  {availableServices.map((service) => (
                    <div key={service} className="flex items-start space-x-3">
                      <Checkbox 
                        id={`service-${service}`} 
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                        className="mt-0.5 rounded-none border-muted-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                      />
                      <label 
                        htmlFor={`service-${service}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3 flex flex-col">
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Preferred Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-none border-border h-10 px-3",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none border-border" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-3">
                  <label htmlFor="time" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Preferred Time
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-none border border-border bg-transparent h-10 px-3 focus-visible:ring-0 focus-visible:border-foreground"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="additionalInfo" className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Additional Details
                </label>
                <Textarea
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Tell us about your current challenges or specific goals..."
                  className="bg-transparent border border-border rounded-none p-3 focus-visible:ring-0 focus-visible:border-foreground text-base min-h-[100px] resize-none text-foreground placeholder:text-muted-foreground/50"
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
                    Processing...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;