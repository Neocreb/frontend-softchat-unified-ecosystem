
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("You've been added to our waitlist! We'll be in touch soon.");
      setEmail('');
      setName('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-softchat-600 to-softchat-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Join the Waitlist
              </h2>
              <p className="text-softchat-100 max-w-lg mx-auto">
                Be among the first to experience the future of social, commerce, and crypto on Softchat. Early users will receive exclusive perks and rewards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/90 border-0 focus:ring-2 focus:ring-white"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/90 border-0 focus:ring-2 focus:ring-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-white text-softchat-700 hover:bg-softchat-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Notify Me'}
              </Button>
              <p className="text-xs text-center text-softchat-100 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
