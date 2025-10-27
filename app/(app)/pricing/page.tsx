'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Get started with basic gamification',
      icon: Sparkles,
      color: 'text-muted-foreground',
      features: [
        { name: 'View your dashboard', included: true },
        { name: 'Track basic progress', included: true },
        { name: 'Earn up to 100 points/day', included: true },
        { name: 'View leaderboard (top 10 only)', included: true },
        { name: 'Unlock 3 starter badges', included: true },
        { name: 'Limited streak tracking', included: true },
        { name: 'Full badge collection', included: false },
        { name: 'Unlimited points', included: false },
        { name: 'Advanced level unlocks', included: false },
        { name: 'Premium badges', included: false },
      ],
      cta: 'Current Plan',
      ctaDisabled: true,
    },
    {
      name: 'Premium',
      price: '$9',
      period: '/month',
      description: 'Full gamification experience',
      icon: Crown,
      color: 'text-primary',
      popular: true,
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Unlimited points earning', included: true },
        { name: 'Full leaderboard access', included: true },
        { name: 'Unlock ALL badges', included: true },
        { name: 'Advanced level progression', included: true },
        { name: 'Streak bonuses & rewards', included: true },
        { name: 'Content unlocks by level', included: true },
        { name: 'Priority support', included: true },
        { name: 'Early access to features', included: true },
        { name: 'Custom profile badges', included: true },
      ],
      cta: 'Upgrade Now',
      ctaDisabled: false,
    },
  ];

  const handleUpgrade = () => {
    window.location.href = process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL || 'https://whop.com/your-product';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Start free, upgrade when you're ready for more
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative ${tier.popular ? 'border-primary/50 shadow-lg shadow-primary/10' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8 pt-8">
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center ${tier.color}`}>
                    <tier.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? '' : 'text-muted-foreground/70'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleUpgrade}
                    disabled={tier.ctaDisabled}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.popular && <Sparkles className="w-4 h-4 mr-2" />}
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Can I try Premium for free?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start with our Free tier to experience the gamification system. When you're ready for unlimited features, upgrade to Premium.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! Cancel your Premium subscription anytime. You'll keep access until the end of your billing period, then revert to Free tier.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">What happens to my progress if I downgrade?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your points, badges, and progress are never lost! You just won't be able to earn new Premium badges until you upgrade again.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-lg">How do payments work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All payments are securely processed through Whop. Choose monthly or yearly billing with multiple payment methods supported.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
