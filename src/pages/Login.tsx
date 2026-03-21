import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { useAuth, Role } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Logo } from '@/components/Logo';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success(t('auth.success'));
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('auth.invalid_credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gold-500 blur-[120px]" />
      </div>

      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md border-border shadow-2xl relative bg-surface/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2 pt-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold text-text-primary">{t('auth.login_title')}</CardTitle>
          <p className="text-sm text-text-secondary">{t('auth.login_description')}</p>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label={t('common.email')}
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label={t('common.password')}
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button type="submit" className="w-full h-11 text-base mt-2" isLoading={isLoading}>
              {t('common.login')}
            </Button>
          </form>
          
          <div className="mt-8 p-4 bg-gold-100/30 rounded-xl border border-gold-200/50">
            <p className="text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">Demo Accounts:</p>
            <div className="space-y-1.5 text-xs text-text-secondary font-medium">
              <p className="flex justify-between"><span>• admin@lanedu.com</span> <span className="text-gold-700 font-bold">(Admin)</span></p>
              <p className="flex justify-between"><span>• teacher@lanedu.com</span> <span className="text-gold-700 font-bold">(Teacher)</span></p>
              <p className="flex justify-between"><span>• student@lanedu.com</span> <span className="text-gold-700 font-bold">(Student)</span></p>
              <div className="pt-2 mt-2 border-t border-gold-200/30 flex justify-between items-center">
                <span className="text-text-disabled">Password:</span>
                <span className="font-bold text-gold-700">123456</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
