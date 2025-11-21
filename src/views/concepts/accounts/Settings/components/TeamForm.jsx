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

const roleOptions = [
  { value: 'secretaria', label: 'Secretaria(o)' },
  { value: 'advogado', label: 'Advogado(a)' },
  { value: 'estagiario', label: 'Estagiário(a)' },
  { value: 'financeiro', label: 'Financeiro' },
]

const TeamForm = ({ onClose, onSave, disableSave }) => {
  const { control, watch, handleSubmit, reset } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const role = watch('role')

  const onSubmit = (data) => {
    setSubmitted(true)
    toast.push(
      <Notification type="success">Membro adicionado com sucesso à equipe!</Notification>,
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
        <FormItem label="Selecione a função">
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
        <FormItem label="Nome Completo">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Digite o nome completo" {...field} />
            )}
          />
        </FormItem>
        <FormItem label="CPF">
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Digite o CPF" {...field} />
            )}
          />
        </FormItem>
        {role === 'advogado' && (
          <FormItem label="OAB">
            <Controller
              name="oab"
              control={control}
              render={({ field }) => (
                <Input type="text" placeholder="Digite o número da OAB" {...field} />
              )}
            />
          </FormItem>
        )}
        <FormItem label="Endereço Completo">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Digite o endereço completo" {...field} />
            )}
          />
        </FormItem>
        <FormItem label="Informações de Contato">
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <Input type="text" placeholder="Telefone, WhatsApp ou E-mail" {...field} />
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
