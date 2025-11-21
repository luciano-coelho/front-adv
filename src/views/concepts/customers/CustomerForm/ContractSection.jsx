import Card from '@/components/ui/Card'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { HiCloudUpload, HiDocumentText, HiTrash, HiEye } from 'react-icons/hi'
import { useState, useEffect } from 'react'

const ContractSection = ({ control, errors, viewMode }) => {
    // Documentos existentes - SEMPRE inicia vazio para evitar cache
    const [existingDocuments, setExistingDocuments] = useState([])

    // useEffect para garantir limpeza de cache
    useEffect(() => {
        console.log('ContractSection montado - garantindo limpeza de cache')
    }, [])

    // Função para calcular o tamanho total dos documentos existentes em bytes
    const calculateTotalSize = (documents) => {
        let total = 0
        documents.forEach((doc, index) => {
            const sizeStr = doc.size.toLowerCase().trim()
            let sizeInBytes = 0
            
            // Remove espaços e caracteres especiais
            const cleanSize = sizeStr.replace(/[^0-9.kmgb]/g, '')
            const numericValue = parseFloat(cleanSize)
            
            if (sizeStr.includes('kb')) {
                sizeInBytes = numericValue * 1024
            } else if (sizeStr.includes('mb')) {
                sizeInBytes = numericValue * 1024 * 1024
            } else if (sizeStr.includes('gb')) {
                sizeInBytes = numericValue * 1024 * 1024 * 1024
            } else {
                // Default para KB se não tiver unidade clara
                sizeInBytes = numericValue * 1024
            }
            
            console.log(`Doc ${index + 1}: ${doc.name} = ${doc.size} = ${sizeInBytes} bytes = ${formatBytes(sizeInBytes)}`)
            total += sizeInBytes
        })
        
        console.log(`TOTAL CALCULADO: ${total} bytes = ${formatBytes(total)}`)
        return total
    }

    // Função para formatar bytes em formato legível
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    /* FUNÇÃO HANDLEFILEUPLOAD DESABILITADA - USANDO LÓGICA SIMPLIFICADA
    const handleFileUpload = (files) => {
        if (!files || files.length === 0) {
            console.log('handleFileUpload: Nenhum arquivo para processar')
            return false
        }
        
        console.log('\n=== DEBUG UPLOAD DETALHADO ===')
        console.log('ARQUIVOS RECEBIDOS NO HANDLEFILEUPLOAD:')
        Array.from(files).forEach((file, index) => {
            console.log(`  ${index + 1}. Nome: "${file.name}" | Tamanho: ${formatBytes(file.size)} | Tipo: ${file.type}`)
        })
        
        console.log('\nDocumentos EXISTENTES no estado:')
        existingDocuments.forEach((doc, index) => {
            console.log(`  ${index + 1}. ${doc.name}: ${doc.size}`)
        })
        
        const currentTotalSize = calculateTotalSize(existingDocuments)
        const maxSizeBytes = 25 * 1024 * 1024 // 25MB em bytes
        const remainingSpace = maxSizeBytes - currentTotalSize
        
        console.log(`\nLIMITES:`)
        console.log(`- Máximo permitido: ${formatBytes(maxSizeBytes)}`)
        console.log(`- Usado atualmente: ${formatBytes(currentTotalSize)}`)
        console.log(`- Espaço disponível: ${formatBytes(remainingSpace)}`)
        
        // Calcula o tamanho dos novos arquivos E verifica duplicatas
        const newFilesArray = Array.from(files)
        let newFilesSize = 0
        let duplicatesFound = []
        
        console.log(`\nANALISANDO ${newFilesArray.length} NOVOS ARQUIVOS:`)
        
        newFilesArray.forEach((file, index) => {
            console.log(`  ${index + 1}. "${file.name}" (${formatBytes(file.size)})`)
            
            // Verifica se é duplicata
            if (isFileAlreadyExists(file, existingDocuments)) {
                duplicatesFound.push(file.name)
            } else {
                newFilesSize += file.size
            }
        })
        
        // Se há duplicatas, informa e para o processo
        if (duplicatesFound.length > 0) {
            alert(`Os seguintes arquivos já existem e foram ignorados:\n\n${duplicatesFound.map(name => `- ${name}`).join('\n')}`)
            return false
        }
        
        console.log(`\nNOVOS ARQUIVOS:`)
        console.log(`- Total dos novos: ${formatBytes(newFilesSize)}`)
        console.log(`- Total após adição: ${formatBytes(currentTotalSize + newFilesSize)}`)
        console.log(`- Excederá limite? ${currentTotalSize + newFilesSize > maxSizeBytes ? 'SIM' : 'NÃO'}`)
        
        // Verifica limite considerando os novos arquivos
        if (currentTotalSize + newFilesSize > maxSizeBytes) {
            const message = `Limite de armazenamento excedido!\n\nResumo:\n- Usado: ${formatBytes(currentTotalSize)}\n- Disponível: ${formatBytes(remainingSpace)}\n- Tentando adicionar: ${formatBytes(newFilesSize)}\n- Limite: 25MB\n\nVocê precisa de ${formatBytes(newFilesSize - remainingSpace)} a mais de espaço.`
            alert(message)
            // IMPORTANTE: Limpa o campo para evitar acúmulo de arquivos
            return // Para aqui sem processar
        }

        // Processa todos os arquivos
        const validFiles = []
        const duplicateFiles = []
        
        for (let file of newFilesArray) {
            // PRIMEIRA VERIFICAÇÃO: Se já existe
            if (isFileAlreadyExists(file, existingDocuments)) {
                duplicateFiles.push(file.name)
                continue
            }
            
            // Validações para cada arquivo
            const allowedTypes = [
                'application/pdf',
                'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png'
            ]
            
            const isAllowed = allowedTypes.includes(file.type) || file.name.toLowerCase().endsWith('.pdf')
            if (!isAllowed) {
                alert(`Arquivo "${file.name}" não é permitido. Tipos aceitos: PDF, DOC, DOCX, JPG, PNG`)
                continue
            }
            
            const isLt10M = file.size / 1024 / 1024 < 10
            if (!isLt10M) {
                alert(`Arquivo "${file.name}" é muito grande (máx 10MB)!`)
                continue
            }

            validFiles.push(file)
        }
        
        // Feedback para duplicatas
        if (duplicateFiles.length > 0) {
            alert(`Arquivos já existentes (ignorados):\n- ${duplicateFiles.join('\n- ')}`)
        }
        
        if (validFiles.length === 0) {
            if (duplicateFiles.length > 0) {
                return false // Todos eram duplicatas
            }
            return false // Nenhum arquivo válido
        }

        // Adiciona todos os arquivos válidos à lista
        const newFiles = validFiles.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            type: getFileType(file),
            size: formatFileSize(file.size),
            uploadDate: new Date().toLocaleDateString('pt-BR')
        }))
        
        setExistingDocuments(prev => [...prev, ...newFiles])
        
        // Feedback positivo
        if (validFiles.length === 1) {
            alert(`Arquivo "${validFiles[0].name}" adicionado com sucesso!`)
        } else {
            alert(`${validFiles.length} arquivos adicionados com sucesso!`)
        }
        
        return true // Retorna true para indicar sucesso
    }
    */

    const getFileType = (file) => {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            return 'pdf'
        }
        if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'doc'
        }
        if (file.type.includes('image')) {
            return 'image'
        }
        return 'document'
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleDeleteDocument = (docId) => {
        if (confirm('Tem certeza que deseja excluir este documento?')) {
            setExistingDocuments(prev => prev.filter(doc => doc.id !== docId))
        }
    }

    const handleViewDocument = (doc) => {
        // Em produção, abriria o documento
        alert(`Visualizando: ${doc.name}`)
    }

    const getFileIcon = (type) => {
        switch(type) {
            case 'pdf':
                return <span className="text-red-600 text-xl">📄</span>
            case 'doc':
                return <span className="text-blue-600 text-xl">📝</span>
            case 'image':
                return <span className="text-green-600 text-xl">🖼️</span>
            default:
                return <HiDocumentText className="text-blue-600" />
        }
    }

    return (
        <Card>
            <h4 className="mb-6">Documentos Relevantes</h4>
            
            {/* Lista de documentos existentes */}
            {existingDocuments.length > 0 && (
                <div className="mb-6">
                    <h6 className="text-sm font-semibold text-gray-600 mb-3">
                        Documentos Salvos ({existingDocuments.length})
                    </h6>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {existingDocuments.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-xl flex-shrink-0">
                                        {getFileIcon(doc.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate" title={doc.name}>
                                            {doc.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {doc.size} • {doc.uploadDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                    <Button 
                                        size="xs" 
                                        variant="plain"
                                        icon={<HiEye />}
                                        className="text-gray-600 hover:text-blue-600"
                                        title="Visualizar"
                                        onClick={() => handleViewDocument(doc)}
                                    />
                                    <Button 
                                        size="xs" 
                                        variant="plain"
                                        icon={<HiTrash />}
                                        className="text-gray-600 hover:text-red-600"
                                        title="Excluir"
                                        disabled={viewMode}
                                        onClick={() => handleDeleteDocument(doc.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4 border-gray-200 dark:border-gray-600" />
                </div>
            )}
            
            {/* Área de upload para novos documentos */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h6 className="text-sm font-semibold text-gray-600">
                        Adicionar Novo Documento
                    </h6>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        calculateTotalSize(existingDocuments) >= 25 * 1024 * 1024 
                            ? 'bg-red-100 text-red-600' 
                            : calculateTotalSize(existingDocuments) >= 20 * 1024 * 1024
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                    }`}>
                        {formatBytes(calculateTotalSize(existingDocuments))}/25MB
                    </span>
                </div>
                
                {calculateTotalSize(existingDocuments) >= 25 * 1024 * 1024 ? (
                    <div className="py-6 px-4 text-center bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-3xl mb-2 flex justify-center text-gray-400">
                            🚫
                        </div>
                        <p className="font-semibold text-gray-600 mb-1">
                            Limite de armazenamento atingido
                        </p>
                        <p className="text-xs text-gray-500">
                            Você atingiu o limite de 25MB. Exclua alguns documentos para adicionar novos.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Espaço usado: {formatBytes(calculateTotalSize(existingDocuments))}
                        </p>
                    </div>
                ) : (
                    <FormItem
                        label=""
                        invalid={Boolean(errors.contractFile)}
                        errorMessage={errors.contractFile?.message}
                        className="mb-4"
                    >
                        <Controller
                            name="contractFile"
                            control={control}
                            render={({ field }) => (
                                <Upload
                                    className="min-h-fit"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    showList={false}
                                    draggable={true}
                                    multiple={false}
                                    disabled={viewMode || calculateTotalSize(existingDocuments) >= 25 * 1024 * 1024}
                                    onChange={(files) => {
                                        console.log('\n🆕 UPLOAD LIMPO - RESET TOTAL')
                                        console.log('=============================')
                                        
                                        // RESET TOTAL - Limpa tudo
                                        field.onChange(null)
                                        
                                        // Se não há arquivos, para aqui
                                        if (!files || files.length === 0) {
                                            console.log('❌ Nenhum arquivo - parando')
                                            return
                                        }
                                        
                                        // Pega apenas o primeiro arquivo (ignora resto)
                                        const file = files[0]
                                        console.log(`📁 NOVO ARQUIVO: "${file.name}" (${formatBytes(file.size)})`)
                                        
                                        // IMPORTANTE: Pega estado atual REAL (não cached)
                                        const currentDocs = existingDocuments || []
                                        console.log(`📊 Documentos atuais: ${currentDocs.length}`)
                                        
                                        // Verifica duplicata no estado atual
                                        const hasDuplicate = currentDocs.some(doc => doc.name === file.name)
                                        if (hasDuplicate) {
                                            console.log(`❌ DUPLICATA: "${file.name}"`)
                                            alert(`Arquivo "${file.name}" já existe!`)
                                            return
                                        }
                                        
                                        // Calcula tamanho com estado atual
                                        const currentSize = calculateTotalSize(currentDocs)
                                        const maxSize = 25 * 1024 * 1024
                                        
                                        console.log(`💾 Espaço atual: ${formatBytes(currentSize)}/${formatBytes(maxSize)}`)
                                        
                                        if (currentSize + file.size > maxSize) {
                                            const available = maxSize - currentSize
                                            console.log(`❌ ESPAÇO INSUFICIENTE`)
                                            alert(`Espaço insuficiente!\nDisponível: ${formatBytes(available)}\nArquivo: ${formatBytes(file.size)}`)
                                            return
                                        }
                                        
                                        // Validação de tipo - INCLUINDO CSV
                                        const allowedTypes = [
                                            'application/pdf', 
                                            'application/msword', 
                                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                            'application/vnd.ms-excel',
                                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                            'text/csv',
                                            'text/plain',
                                            'image/jpeg', 
                                            'image/jpg', 
                                            'image/png'
                                        ]
                                        
                                        const fileExtension = file.name.toLowerCase().split('.').pop()
                                        const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'jpg', 'jpeg', 'png']
                                        
                                        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                                            console.log(`❌ TIPO INVÁLIDO: ${file.type} | Extensão: .${fileExtension}`)
                                            alert(`Tipo de arquivo não permitido!\nTipo detectado: ${file.type}\nExtensão: .${fileExtension}\n\nTipos aceitos: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT, JPG, PNG`)
                                            return
                                        }
                                        
                                        console.log(`✅ TIPO VÁLIDO: ${file.type} | .${fileExtension}`)
                                        
                                        // Validação de tamanho individual
                                        if (file.size > 10 * 1024 * 1024) {
                                            console.log(`❌ ARQUIVO GRANDE: ${formatBytes(file.size)}`)
                                            alert('Arquivo muito grande (máx 10MB)!')
                                            return
                                        }
                                        
                                        // Cria documento novo
                                        const newDoc = {
                                            id: Date.now() + Math.random(), // ID único
                                            name: file.name,
                                            type: getFileType(file),
                                            size: formatFileSize(file.size),
                                            uploadDate: new Date().toLocaleDateString('pt-BR')
                                        }
                                        
                                        // ADICIONA sem preservar cache antigo
                                        setExistingDocuments(currentDocs => {
                                            const newList = [...currentDocs, newDoc]
                                            console.log(`✅ ADICIONADO! Total: ${newList.length} documentos`)
                                            return newList
                                        })
                                        
                                        console.log('✅ PROCESSO CONCLUÍDO!')
                                        alert(`Arquivo "${file.name}" adicionado com sucesso!`)
                                    }}
                                >
                                    <div className="py-6 px-4 text-center flex flex-col items-center justify-center">
                                        <div className="text-3xl mb-2 flex justify-center text-gray-400">
                                            <HiCloudUpload />
                                        </div>
                                        <p className="font-semibold mb-1">
                                            <span className="text-gray-800 dark:text-white">
                                                Clique para fazer upload
                                            </span>
                                            <span className="text-gray-500"> ou arraste e solte</span>
                                        </p>
                                        <p className="opacity-60 dark:text-white text-xs text-center">
                                            PDF, DOC, DOCX, JPG, PNG (máx 10MB)
                                        </p>
                                    </div>
                                </Upload>
                            )}
                        />
                    </FormItem>
                )}
            </div>
        </Card>
    )
}

export default ContractSection