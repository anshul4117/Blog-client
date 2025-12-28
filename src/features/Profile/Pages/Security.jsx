import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Shield, Key, Smartphone, Laptop, CheckCircle2, AlertTriangle, Fingerprint, QrCode, Copy, ArrowRight,
    Mail, MessageSquare, Usb, Bell, Globe, ChevronRight, MoreHorizontal
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageTransition from "@/components/layout/PageTransition";
import { PasswordInput } from "@/components/ui/password-input";

// Validation Schema
const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function Security() {
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // 2FA State
    const [authenticatorEnabled, setAuthenticatorEnabled] = useState(false);
    const [smsEnabled, setSmsEnabled] = useState(false);
    const [securityKeyEnabled, setSecurityKeyEnabled] = useState(false);

    // Dialog States
    const [activeDialog, setActiveDialog] = useState(null); // 'authenticator', 'sms', 'key'
    const [setupStep, setSetupStep] = useState(1);
    const [verifyCode, setVerifyCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    // Advanced Settings State
    const [trustThisDevice, setTrustThisDevice] = useState(true);
    const [loginAlertsEmail, setLoginAlertsEmail] = useState(true);
    const [loginAlertsPush, setLoginAlertsPush] = useState(false);

    // Form Setup
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
        resolver: zodResolver(passwordSchema)
    });

    const onSubmit = async () => {
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSuccessMsg("Password successfully updated!");
            reset();
        } catch {
            setErrorMsg("Failed to update password. Please try again.");
        }
    };

    // Helper Functions
    const openDialog = (type) => {
        setActiveDialog(type);
        setSetupStep(1);
        setVerifyCode("");
        setPhoneNumber("");
    };

    const closeDialog = () => {
        setActiveDialog(null);
    };

    const handleNextStep = () => {
        setSetupStep(prev => prev + 1);
    };

    const handleVerify = async () => {
        setIsVerifying(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsVerifying(false);

        if (activeDialog === 'authenticator') setAuthenticatorEnabled(true);
        if (activeDialog === 'sms') setSmsEnabled(true);
        if (activeDialog === 'key') setSecurityKeyEnabled(true);

        handleNextStep();
    };

    const activeSessions = [
        { id: 1, device: "MacBook Pro", browser: "Chrome", location: "New York, USA", active: true, icon: Laptop, ip: "192.168.1.1" },
        { id: 2, device: "iPhone 14", browser: "Safari", location: "New York, USA", active: false, lastActive: "2 hours ago", icon: Smartphone, ip: "192.168.1.25" },
    ];

    const renderDialogContent = () => {
        switch (activeDialog) {
            case 'authenticator':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Set up Authenticator App</DialogTitle>
                            <DialogDescription>
                                {setupStep === 1 && "Get code from an app like Google Authenticator."}
                                {setupStep === 2 && "Scan this QR code."}
                                {setupStep === 3 && "Enter the 6-digit verification code."}
                                {setupStep === 4 && "Authenticator app configured!"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {setupStep === 1 && (
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                                    <div className="p-3 bg-primary/10 text-primary rounded-full">
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-medium">Recommended</h4>
                                        <p className="text-xs text-muted-foreground">This is the most secure and reliable method.</p>
                                    </div>
                                </div>
                            )}
                            {setupStep === 2 && (
                                <div className="flex flex-col items-center gap-4">
                                    <QrCode className="w-32 h-32 text-gray-800 p-2 bg-white rounded border" />
                                    <div className="text-center text-xs text-muted-foreground">
                                        <p>Unable to scan?</p>
                                        <code className="bg-muted px-2 py-1 rounded">ABCD 1234 EFGH 5678</code>
                                    </div>
                                </div>
                            )}
                            {setupStep === 3 && (
                                <div className="space-y-2">
                                    <Label>Verification Code</Label>
                                    <Input
                                        placeholder="000 000" className="text-center text-lg tracking-widest font-mono"
                                        maxLength={6}
                                        value={verifyCode}
                                        onChange={e => setVerifyCode(e.target.value)}
                                    />
                                </div>
                            )}
                            {setupStep === 4 && (
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                    <p>You can now use your authenticator app to sign in.</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            {setupStep < 4 ? (
                                <>
                                    <Button variant="ghost" onClick={closeDialog}>Cancel</Button>
                                    {setupStep === 3 ? (
                                        <Button onClick={handleVerify} disabled={isVerifying || verifyCode.length < 6}>
                                            {isVerifying ? "Verifying..." : "Verify"}
                                        </Button>
                                    ) : (
                                        <Button onClick={handleNextStep}>Next</Button>
                                    )}
                                </>
                            ) : (
                                <Button onClick={closeDialog} className="w-full">Done</Button>
                            )}
                        </DialogFooter>
                    </>
                );
            case 'sms':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Set up SMS Authentication</DialogTitle>
                            <DialogDescription>
                                {setupStep === 1 && "We'll send a code to your phone number."}
                                {setupStep === 2 && "Enter the code sent to your phone."}
                                {setupStep === 3 && "SMS authentication enabled!"}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {setupStep === 1 && (
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <div className="flex gap-2">
                                        <Input placeholder="+1 (555) 000-0000" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {setupStep === 2 && (
                                <div className="space-y-2">
                                    <Label>Enter Code</Label>
                                    <Input
                                        placeholder="000 000" className="text-center text-lg tracking-widest font-mono"
                                        maxLength={6}
                                        value={verifyCode}
                                        onChange={e => setVerifyCode(e.target.value)}
                                    />
                                </div>
                            )}
                            {setupStep === 3 && (
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                                    <p>SMS backup has been added.</p>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            {setupStep < 3 ? (
                                <>
                                    <Button variant="ghost" onClick={closeDialog}>Cancel</Button>
                                    {setupStep === 1 ? (
                                        <Button onClick={handleNextStep} disabled={!phoneNumber}>Send Code</Button>
                                    ) : (
                                        <Button onClick={handleVerify} disabled={isVerifying || verifyCode.length < 6}>
                                            {isVerifying ? "Verifying..." : "Verify"}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Button onClick={closeDialog} className="w-full">Done</Button>
                            )}
                        </DialogFooter>
                    </>
                );
            case 'key':
                return (
                    <>
                        <DialogHeader>
                            <DialogTitle>Add Security Key</DialogTitle>
                            <DialogDescription>
                                Use a physical security key (like YubiKey) or your device's biometrics.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-8 flex flex-col items-center justify-center space-y-4">
                            {setupStep === 1 && (
                                <>
                                    <div className="p-6 bg-muted rounded-full">
                                        <Usb className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-center max-w-xs text-muted-foreground">
                                        When you're ready, click "Start" and follow your browser's instructions.
                                    </p>
                                </>
                            )}
                            {setupStep === 2 && (
                                <>
                                    <div className="p-6 bg-green-100 rounded-full animate-pulse">
                                        <Usb className="h-10 w-10 text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium">Waiting for key...</p>
                                </>
                            )}
                            {setupStep === 3 && (
                                <>
                                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                                    <p>Security key registered successfully!</p>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            {setupStep === 1 && (
                                <>
                                    <Button variant="ghost" onClick={closeDialog}>Cancel</Button>
                                    <Button onClick={() => { setSetupStep(2); setTimeout(handleVerify, 2000); }}>Start Setup</Button>
                                </>
                            )}
                            {setupStep === 3 && <Button onClick={closeDialog} className="w-full">Done</Button>}
                        </DialogFooter>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <PageTransition>
            <div className="container max-w-4xl mx-auto py-6 space-y-8">

                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your password, 2FA methods, and login activity.
                    </p>
                </div>

                <div className="grid gap-6">

                    {/* Change Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" />
                                Password
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                                {successMsg && <div className="text-green-600 text-sm flex items-center gap-2"><CheckCircle2 size={16} />{successMsg}</div>}
                                {errorMsg && <div className="text-red-600 text-sm flex items-center gap-2"><AlertTriangle size={16} />{errorMsg}</div>}

                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <PasswordInput {...register("currentPassword")} error={errors.currentPassword?.message} />
                                    {errors.currentPassword && <p className="text-xs text-red-500">{errors.currentPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <PasswordInput {...register("newPassword")} error={errors.newPassword?.message} />
                                    {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm Password</Label>
                                    <PasswordInput {...register("confirmPassword")} error={errors.confirmPassword?.message} />
                                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                                </div>
                                <Button type="submit" disabled={isSubmitting}>Update Password</Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Advanced 2FA Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Two-Factor Authentication
                            </CardTitle>
                            <CardDescription>Add additional security methods to your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Authenticator App */}
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Authenticator App</p>
                                        <p className="text-sm text-muted-foreground">Use Google Auth, Authy, etc.</p>
                                    </div>
                                </div>
                                {authenticatorEnabled ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-green-600">On</span>
                                        <Button variant="outline" size="sm" onClick={() => setAuthenticatorEnabled(false)}>Manage</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => openDialog('authenticator')}>Set up</Button>
                                )}
                            </div>

                            {/* SMS */}
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                        <MessageSquare className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Text Message (SMS)</p>
                                        <p className="text-sm text-muted-foreground">Receive codes via SMS.</p>
                                    </div>
                                </div>
                                {smsEnabled ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-green-600">On</span>
                                        <Button variant="outline" size="sm" onClick={() => setSmsEnabled(false)}>Manage</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => openDialog('sms')}>Add</Button>
                                )}
                            </div>

                            {/* Security Key */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                                        <Usb className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Security Key</p>
                                        <p className="text-sm text-muted-foreground">YubiKey, Titan, or FaceID/TouchID.</p>
                                    </div>
                                </div>
                                {securityKeyEnabled ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-green-600">1 key</span>
                                        <Button variant="outline" size="sm" onClick={() => setSecurityKeyEnabled(false)}>Manage</Button>
                                    </div>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => openDialog('key')}>Add Key</Button>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* Login Alerts & Trusted Devices */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Bell className="h-4 w-4" /> Login Alerts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email-alerts" className="space-y-1">
                                        <span>Email Alerts</span>
                                        <p className="text-xs text-muted-foreground">Get notified at {activeSessions[0]?.ip ? "your email" : "email"}</p>
                                    </Label>
                                    <Switch id="email-alerts" checked={loginAlertsEmail} onCheckedChange={setLoginAlertsEmail} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="push-alerts" className="space-y-1">
                                        <span>Push Notifications</span>
                                        <p className="text-xs text-muted-foreground">Alerts on mobile app</p>
                                    </Label>
                                    <Switch id="push-alerts" checked={loginAlertsPush} onCheckedChange={setLoginAlertsPush} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Fingerprint className="h-4 w-4" /> Trusted Devices
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">Trust this device</p>
                                        <p className="text-xs text-muted-foreground">Don't ask for 2FA on this browser.</p>
                                    </div>
                                    <Switch checked={trustThisDevice} onCheckedChange={setTrustThisDevice} />
                                </div>
                                <Button variant="outline" size="sm" className="w-full">
                                    Revoke all trusted devices
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Active Sessions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Active Sessions
                            </CardTitle>
                            <CardDescription>
                                Devices logged into your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {activeSessions.map(session => (
                                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-background rounded-full border">
                                            <session.icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm flex items-center gap-2">
                                                {session.device}
                                                {session.active && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Current</span>}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {session.location} • {session.browser} • {session.ip}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0 transition-opacity">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="text-red-500">Log out</DropdownMenuItem>
                                            <DropdownMenuItem>Don't trust</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Delete Account */}
                    <Card className="border-red-200 dark:border-red-900/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
                                <AlertTriangle className="h-5 w-5" />
                                Danger Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h4 className="font-medium">Delete Account</h4>
                                <p className="text-sm text-muted-foreground">Permanent action.</p>
                            </div>
                            <Button variant="destructive" size="sm">Delete</Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Global Dialog */}
                <Dialog open={!!activeDialog} onOpenChange={closeDialog}>
                    <DialogContent className="sm:max-w-md">
                        {renderDialogContent()}
                    </DialogContent>
                </Dialog>

            </div>
        </PageTransition>
    );
}
