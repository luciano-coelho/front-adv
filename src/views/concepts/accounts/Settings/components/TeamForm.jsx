import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

// Funções utilitárias copiadas do SettingsProfile.jsx
const formatCPF = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }
}

const formatOAB = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  return numbers.slice(0, 6)
}

const formatPhoneNumber = (value) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

const roleOptions = [
  { value: 'secretaria', label: 'Secretaria(o)' },
  { value: 'advogado', label: 'Advogado(a)' },
  { value: 'estagiario', label: 'Estagiário(a)' },
  { value: 'financeiro', label: 'Financeiro' },
]

import { z } from 'zod'
const oabStates = [
  { value: 'AC', label: 'Acre (AC)' },
  { value: 'AL', label: 'Alagoas (AL)' },
  { value: 'AP', label: 'Amapá (AP)' },
  { value: 'AM', label: 'Amazonas (AM)' },
  { value: 'BA', label: 'Bahia (BA)' },
  { value: 'CE', label: 'Ceará (CE)' },
  { value: 'DF', label: 'Distrito Federal (DF)' },
  { value: 'ES', label: 'Espírito Santo (ES)' },
  { value: 'GO', label: 'Goiás (GO)' },
  { value: 'MA', label: 'Maranhão (MA)' },
  { value: 'MT', label: 'Mato Grosso (MT)' },
  { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
  { value: 'MG', label: 'Minas Gerais (MG)' },
  { value: 'PA', label: 'Pará (PA)' },
  { value: 'PB', label: 'Paraíba (PB)' },
  { value: 'PR', label: 'Paraná (PR)' },
  { value: 'PE', label: 'Pernambuco (PE)' },
  { value: 'PI', label: 'Piauí (PI)' },
  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
  { value: 'RS', label: 'Rio Grande do Sul (RS)' },
  { value: 'RO', label: 'Rondônia (RO)' },
  { value: 'RR', label: 'Roraima (RR)' },
  { value: 'SC', label: 'Santa Catarina (SC)' },
  { value: 'SP', label: 'São Paulo (SP)' },
  { value: 'SE', label: 'Sergipe (SE)' },
  { value: 'TO', label: 'Tocantins (TO)' }
]

const oabStatusOptions = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'suspenso', label: 'Suspenso' }
]

const validationSchema = z.object({
  role: z.string().min(1, { message: 'Selecione a função' }),
  name: z.string().min(1, { message: 'Digite o nome completo' }),
  cpf: z.string().min(1, { message: 'Digite o CPF' }),
  oabNumber: z.string().optional(),
  oabState: z.string().optional(),
  oabStatus: z.string().optional(),
  address: z.string().min(1, { message: 'Digite o endereço completo' }),
  phone: z.string().min(1, { message: 'Digite o telefone/WhatsApp' }),
  email: z.string().min(1, { message: 'Digite o e-mail' }).email({ message: 'E-mail inválido' }),
})

const TeamForm = ({ onClose, onSave, disableSave }) => {
  const { control, watch, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: async (values, context, options) => {
      try {
        const result = validationSchema.parse(values)
        return { values: result, errors: {} }
      } catch (err) {
        return { values: {}, errors: err.formErrors?.fieldErrors || {} }
      }
    }
  })
  const [submitted, setSubmitted] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const role = watch('role')

  const onSubmit = (data) => {
    setSubmitted(true)
    toast.push(
      <Notification type="success">
        Membro adicionado com sucesso à equipe!<br />
        Um e-mail será enviado para o membro criar sua senha de acesso ao sistema.
      </Notification>,
      { placement: 'top-center' },
    )
    if (onSave) onSave(data)
    reset()
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    setDeleteDialogOpen(false)
    toast.push(
      <Notification type="success">Membro removido com sucesso do seu escritório</Notification>,
      { placement: 'top-center' },
    )
    reset()
  }

  const cancelDelete = () => {
    setDeleteDialogOpen(false)
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <h4 className="mb-7">Adicionar Membro à Equipe</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormItem label="Selecione a função" invalid={Boolean(errors.role)} errorMessage={errors.role?.message}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                options={roleOptions}
                {...field}
                placeholder="Selecione a função"
                value={roleOptions.find(option => option.value === field.value)}
                onChange={option => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        <FormItem label="Nome Completo" invalid={Boolean(errors.name)} errorMessage={errors.name?.message}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Digite o nome completo" {...field} />
            )}
          />
        </FormItem>
        <FormItem label="CPF" invalid={Boolean(errors.cpf)} errorMessage={errors.cpf?.message}>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Digite o CPF"
                value={formatCPF(field.value || '')}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormItem>
        {role === 'advogado' && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid md:grid-cols-3 gap-4">
              <FormItem label="Número OAB *" invalid={Boolean(errors.oabNumber)} errorMessage={errors.oabNumber?.message}>
                <Controller
                  name="oabNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="Digite o número da OAB"
                      value={formatOAB(field.value || '')}
                      onChange={e => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem label="UF da OAB *" invalid={Boolean(errors.oabState)} errorMessage={errors.oabState?.message}>
                <Controller
                  name="oabState"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={oabStates}
                      {...field}
                      placeholder="Selecione o estado"
                      value={oabStates.find(option => option.value === field.value)}
                      onChange={option => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem label="Situação OAB *" invalid={Boolean(errors.oabStatus)} errorMessage={errors.oabStatus?.message}>
                <Controller
                  name="oabStatus"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={oabStatusOptions}
                      {...field}
                      placeholder="Status"
                      value={oabStatusOptions.find(option => option.value === field.value)}
                      onChange={option => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
            </div>
          </div>
        )}
        <FormItem label="Endereço Completo" invalid={Boolean(errors.address)} errorMessage={errors.address?.message}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Digite o endereço completo" {...field} />
            )}
          />
        </FormItem>
        <FormItem label="Telefone/WhatsApp" invalid={Boolean(errors.phone)} errorMessage={errors.phone?.message}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Digite o telefone ou WhatsApp"
                value={formatPhoneNumber(field.value || '')}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormItem>
        <FormItem label="E-mail" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                placeholder="Digite o e-mail"
                value={field.value || ''}
                onChange={e => field.onChange(e.target.value)}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormItem>
        <div className="flex gap-3 mt-4 justify-end">
          <Button type="button" variant="plain" customColorClass={() => 'border-error text-error'} onClick={onClose}>
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V6a3 3 0 013-3v0a3 3 0 013 3v1m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7m5 4v6m-4-6v6m8-6v6" /></svg>
              Descartar
            </span>
          </Button>
          <Button type="submit" variant="solid" disabled={disableSave} title={disableSave ? 'Limite máximo de 5 membros atingido' : ''}>Salvar</Button>
        </div>
        {submitted && <div className="mt-4 text-green-600">Membro cadastrado!</div>}
      </form>
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        type="danger"
        title="Excluir membro da equipe"
        onClose={cancelDelete}
        onRequestClose={cancelDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      >
        <p>Tem certeza que deseja excluir completamente o membro da equipe?</p>
      </ConfirmDialog>
    </Card>

  );
}

export default TeamForm;
