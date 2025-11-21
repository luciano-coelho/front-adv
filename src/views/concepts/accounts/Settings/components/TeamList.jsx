import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { teamListMockData } from '@/mock/teamListMockData'
import { useState } from 'react'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const TeamList = ({ team, onAddMember, onRemoveMember }) => {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)

  const askRemove = (id) => {
    setMemberToRemove(id)
    setRemoveDialogOpen(true)
  }

  const confirmRemove = () => {
    toast.push(
      <Notification type="success">Membro removido com sucesso do seu escritório</Notification>,
      { placement: 'top-center' },
    )
    setRemoveDialogOpen(false)
    setMemberToRemove(null)
    if (onRemoveMember) onRemoveMember(memberToRemove)
  }

  const cancelRemove = () => {
    setRemoveDialogOpen(false)
    setMemberToRemove(null)
  }

    return (
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-2">Minha Equipe</h2>
        <p className="text-gray-500 mb-8">Gerencie os membros do seu escritório. Adicione, visualize ou remova membros conforme necessário. O limite é de até 5 pessoas.</p>
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold text-lg">Membros cadastrados</span>
            <Button
              type="button"
              variant="solid"
              onClick={onAddMember}
              disabled={team.length >= 5}
              title={team.length >= 5 ? 'Limite máximo de 5 membros atingido' : ''}
            >
              Adicionar membro
            </Button>
          </div>
          <ul>
            {team.length === 0 && <li className="text-center text-gray-400">Nenhum membro cadastrado.</li>}
            {team.map(member => (
              <li key={member.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-semibold">{member.name}</span> <span className="text-xs text-gray-500">({member.role})</span><br />
                  <span className="text-xs text-gray-500">{member.contact}</span>
                </div>
                <Button type="button" variant="plain" customColorClass={() => 'border-error text-error'} onClick={() => askRemove(member.id)}>
                  Remover
                </Button>
              </li>
            ))}
          </ul>
          <ConfirmDialog
            isOpen={removeDialogOpen}
            type="danger"
            title="Excluir membro da equipe"
            onClose={cancelRemove}
            onRequestClose={cancelRemove}
            onCancel={cancelRemove}
            onConfirm={confirmRemove}
          >
            <p>Tem certeza que deseja excluir completamente o membro da equipe?</p>
          </ConfirmDialog>
        </Card>
      </div>
    )
}

export default TeamList
