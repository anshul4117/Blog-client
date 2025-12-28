import React from 'react';
import { Search, HelpCircle, Book, User, Settings, Shield, MessageCircle, Mail, ExternalLink, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import PageTransition from "@/components/layout/PageTransition";

export default function Help() {
    const categories = [
        { icon: Book, title: "Getting Started", description: "Learn the basics of using our platform" },
        { icon: User, title: "Account & Profile", description: "Manage your account settings and profile" },
        { icon: Shield, title: "Security & Privacy", description: "Protect your account and personal data" },
        { icon: Settings, title: "Billing & Plans", description: "Manage subscriptions and payment methods" },
    ];

    const faqs = [
        {
            question: "How do I reset my password?",
            answer: "You can reset your password by going to the Login page and clicking on 'Forgot Password'. Follow the instructions sent to your email to create a new password."
        },
        {
            question: "Can I use two-factor authentication?",
            answer: "Yes, we support 2FA via authenticator apps, SMS, and security keys. Go to Settings > Security to enable it."
        },
        {
            question: "How do I delete my account?",
            answer: "To delete your account, visit the Security settings page. Please note that this action is irreversible and will remove all your data."
        },
        {
            question: "Where can I view my login history?",
            answer: "Your active sessions and login history can be viewed in the Security tab under 'Active Sessions'."
        },
        {
            question: "How do I contact support?",
            answer: "If you can't find what you're looking for, you can contact our support team using the buttons at the bottom of this page."
        }
    ];

    return (
        <PageTransition>
            <div className="container max-w-5xl mx-auto py-8 space-y-12">

                {/* Header & Search */}
                <div className="text-center space-y-6 py-8">
                    <h1 className="text-4xl font-bold tracking-tight">How can we help you?</h1>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for answers..."
                            className="pl-10 h-12 text-lg shadow-sm"
                        />
                    </div>
                </div>

                {/* Topic Categories */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, i) => (
                        <Card key={i} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <CardHeader>
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                                    <cat.icon size={20} />
                                </div>
                                <CardTitle className="text-lg">{cat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {cat.description}
                                </p>
                                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read articles <ChevronRight size={16} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto space-y-6">
                    <h2 className="text-2xl font-semibold text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Contact Support */}
                <div className="bg-muted/50 rounded-2xl p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold">Still need help?</h2>
                        <p className="text-muted-foreground">Our support team is available 24/7 to assist you.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="gap-2">
                            <MessageCircle size={18} /> Chat with us
                        </Button>
                        <Button size="lg" variant="outline" className="gap-2">
                            <Mail size={18} /> Email Support
                        </Button>
                    </div>
                    <div className="pt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                        Visit our Developer Docs <ExternalLink size={14} />
                    </div>
                </div>

            </div>
        </PageTransition>
    );
}
