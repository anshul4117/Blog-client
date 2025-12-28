import React, { useState } from 'react';
import {
    Lock, Eye, UserX, Download, ExternalLink, Shield, BellRing,
    MessageSquare, AtSign, Search, Database, FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import PageTransition from "@/components/layout/PageTransition";

export default function Privacy() {
    const [isPrivate, setIsPrivate] = useState(false);
    const [showActivity, setShowActivity] = useState(true);
    const [searchIndexing, setSearchIndexing] = useState(false);
    const [personalizedAds, setPersonalizedAds] = useState(true);

    return (
        <PageTransition>
            <div className="container max-w-4xl mx-auto py-6 space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Privacy Center</h1>
                    <p className="text-muted-foreground">
                        Control your privacy settings, manage your data, and customize your experience.
                    </p>
                </div>

                {/* Top-Level Controls */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Account Privacy */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="h-5 w-5" /> Account Privacy
                            </CardTitle>
                            <CardDescription>
                                When your account is private, only people you approve can see your photos and videos.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="private-account" className="font-medium">Private Account</Label>
                                <Switch id="private-account" checked={isPrivate} onCheckedChange={setIsPrivate} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Status */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Eye className="h-5 w-5" /> Activity Status
                            </CardTitle>
                            <CardDescription>
                                Allow accounts you follow and anyone you message to see when you were last active.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="activity-status" className="font-medium">Show Activity Status</Label>
                                <Switch id="activity-status" checked={showActivity} onCheckedChange={setShowActivity} />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Settings */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Privacy Settings</h2>

                    <Accordion type="single" collapsible className="w-full space-y-4">

                        {/* Interactions */}
                        <AccordionItem value="interactions" className="border rounded-lg px-4 bg-card">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-left">
                                        <span className="font-medium">Interactions</span>
                                        <p className="text-xs text-muted-foreground font-normal">Comments, tags, and mentions</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Allow comments from</p>
                                        <p className="text-xs text-muted-foreground">Everyone</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Allow tags from</p>
                                        <p className="text-xs text-muted-foreground">People you follow</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Allow mentions from</p>
                                        <p className="text-xs text-muted-foreground">Everyone</p>
                                    </div>
                                    <Button variant="outline" size="sm">Edit</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Discoverability */}
                        <AccordionItem value="discoverability" className="border rounded-lg px-4 bg-card">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-left">
                                        <span className="font-medium">Discoverability</span>
                                        <p className="text-xs text-muted-foreground font-normal">Search engines and suggestions</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Search engine indexing</p>
                                        <p className="text-xs text-muted-foreground">Allow search engines to show your profile.</p>
                                    </div>
                                    <Switch checked={searchIndexing} onCheckedChange={setSearchIndexing} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Suggest account into others</p>
                                        <p className="text-xs text-muted-foreground">Choose whether people can see similar account suggestions on your profile.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Ads & Data */}
                        <AccordionItem value="ads" className="border rounded-lg px-4 bg-card">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <Database className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-left">
                                        <span className="font-medium">Ads & Data</span>
                                        <p className="text-xs text-muted-foreground font-normal">Ad preferences and data usage</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Personalized Ads</p>
                                        <p className="text-xs text-muted-foreground">See ads based on your activity on and off the platform.</p>
                                    </div>
                                    <Switch checked={personalizedAds} onCheckedChange={setPersonalizedAds} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Data from partners</p>
                                        <p className="text-xs text-muted-foreground">Manage how we use data from third-party partners.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* Data Management */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5" /> Your Data
                        </CardTitle>
                        <CardDescription>
                            Manage your personal data and download a copy of your information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-1">
                                <h4 className="font-medium text-sm">Download your information</h4>
                                <p className="text-xs text-muted-foreground max-w-sm">
                                    Get a copy of what you've shared on our platform to your email.
                                </p>
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Download size={16} /> Request Download
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t py-3">
                        <div className="w-full flex items-center justify-center gap-6 text-xs text-muted-foreground">
                            <span className="hover:underline cursor-pointer">Privacy Policy</span>
                            <span className="hover:underline cursor-pointer">Cookie Policy</span>
                            <span className="hover:underline cursor-pointer">Terms of Service</span>
                        </div>
                    </CardFooter>
                </Card>

            </div>
        </PageTransition>
    );
}
