import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const createValidationSchema = (t) => z.object({
    email: z
        .string({ required_error: t('auth.enterEmail') || 'Por favor, digite seu email' })
        .min(1, { message: t('auth.enterEmail') || 'Por favor, digite seu email' }),
    password: z
        .string({ required_error: t('auth.enterPassword') || 'Por favor, digite sua senha' })
        .min(1, { message: t('auth.enterPassword') || 'Por favor, digite sua senha' }),
})

const SignInForm = (props) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const { t } = useTranslation()

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            email: 'admin-01@ecme.com',
            password: '123Qwe',
        },
        resolver: zodResolver(createValidationSchema(t)),
    })

    const { signIn } = useAuth()

    const onSignIn = async (values) => {
        const { email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({ email, password })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label={t('auth.email')}
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder={t('auth.email')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label={t('auth.password')}
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="text"
                                placeholder={t('auth.password')}
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? t('auth.signingIn') || 'Entrando...' : t('auth.signIn')}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
