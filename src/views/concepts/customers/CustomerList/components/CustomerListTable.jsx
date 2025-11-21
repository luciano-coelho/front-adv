import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCustomerList from '../hooks/useCustomerList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye, TbEye as TbEyeOpen, TbEyeOff } from 'react-icons/tb'
import { HiMail, HiPhone } from 'react-icons/hi'

const statusColor = {
    ativo: 'bg-emerald-500 text-white',
    inativo: 'bg-red-500 text-white',
    'em-atendimento': 'bg-orange-500 text-white',
    prospectado: 'bg-yellow-500 text-black',
}

const PersonTypeColumn = ({ personType }) => {
    return (
        <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                personType === 'fisica' 
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-orange-100 text-orange-700'
            }`}>
                {personType === 'fisica' ? 'PF' : 'PJ'}
            </span>
        </div>
    )
}

const NameColumn = ({ row }) => {
    return (
        <Link
            className={`hover:text-primary font-semibold text-gray-900 dark:text-gray-100`}
            to={`/concepts/customers/customer-details/${row.id}`}
        >
            {row.firstName}
        </Link>
    )
}

const SecurityKeywordColumn = ({ keyword }) => {
    const [showKeyword, setShowKeyword] = useState(false)
    
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-600 font-mono text-sm">
                {showKeyword ? keyword : '••••••••'}
            </span>
            <Tooltip title={showKeyword ? 'Ocultar palavra chave' : 'Exibir palavra chave'}>
                <button
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowKeyword(!showKeyword)}
                >
                    {showKeyword ? <TbEyeOff className="text-lg" /> : <TbEyeOpen className="text-lg" />}
                </button>
            </Tooltip>
        </div>
    )
}

const ActionColumn = ({ onEdit, onViewDetail }) => {
    return (
        <div className="flex items-center gap-3 justify-end">
            <Tooltip title="Editar">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="Visualizar">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const CustomerListTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCustomer,
        setSelectedCustomer,
        selectedCustomer,
    } = useCustomerList()


    const handleEdit = (customer) => {
        navigate('/concepts/customers/customer-create', { state: { customer } })
    }

    const handleViewDetails = (customer) => {
        navigate(`/concepts/customers/customer-details/${customer.id}`)
    }

    const columns = useMemo(
        () => [
            {
                header: 'Tipo',
                accessorKey: 'personType',
                size: 70, // Suficiente para 'Tipo'
                cell: (props) => {
                    const row = props.row.original
                    return <PersonTypeColumn personType={row.personType} />
                },
            },
            {
                header: 'Nome',
                accessorKey: 'firstName',
                size: 140, // Suficiente para 'Nome'
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'E-mail',
                accessorKey: 'email',
                size: 120, // Suficiente para 'E-mail'
                cell: (props) => {
                    const row = props.row.original
                    const email = row.email
                    const isPreferred = row.primaryContact === 'email'
                    return (
                        <div className="flex items-center gap-2">
                            <span className="truncate" title={email}>
                                {email}
                            </span>
                            {isPreferred && (
                                <Tooltip title="Considere entrar em contato por E-mail">
                                    <HiMail className="text-blue-600 text-lg flex-shrink-0" />
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Celular/WhatsApp',
                accessorKey: 'phoneNumber',
                size: 160, // Suficiente para 'Celular/WhatsApp'
                cell: (props) => {
                    const row = props.row.original
                    const phoneNumber = row.phoneNumber
                    const isPreferred = row.primaryContact === 'whatsapp'
                    return (
                        <div className="flex items-center gap-2">
                            <span>{phoneNumber}</span>
                            {isPreferred && (
                                <Tooltip title="Considere entrar em contato por WhatsApp">
                                    <HiPhone className="text-green-600 text-lg flex-shrink-0" />
                                </Tooltip>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Palavra Chave',
                accessorKey: 'securityKeyword',
                size: 120, // Suficiente para 'Palavra Chave'
                cell: (props) => {
                    const keyword = props.row.original.securityKeyword
                    return <SecurityKeywordColumn keyword={keyword} />
                },
            },
            {
                header: 'Situação',
                accessorKey: 'clientStatus',
                size: 110, // Suficiente para 'Situação'
                cell: (props) => {
                    const status = props.row.original.clientStatus
                    const statusLabels = {
                        ativo: 'Ativo',
                        inativo: 'Inativo', 
                        'em-atendimento': 'Em Atendimento',
                        prospectado: 'Prospectado'
                    }
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[status]}>
                                <span>
                                    {statusLabels[status] || status}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                size: 80,
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ], // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handleSetTableData = (data) => {
        setTableData(data)
        if (selectedCustomer.length > 0) {
            setSelectAllCustomer([])
        }
    }

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked, row) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={customerList}
            noData={!isLoading && customerList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: customerListTotal,
                pageIndex: tableData.pageIndex,
                pageSize: tableData.pageSize,
            }}
            checkboxChecked={(row) =>
                selectedCustomer.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default CustomerListTable
