# nfs-xml2obj

Pacote retorna dados especificos das NFS.

## 🚀 Uso

Exemplo de Uso:

```
import dataNfs from 'nfs-xml2obj'

const dadoV2 = await dataNfs.getDataNFSv2(xmlString)
dadoV2 = [ true,
  {
    cnpjEmit: '12891538000112',
    cnpjDest: '09179444000100',
    valorNF: '340.00',
    Numero: '2185'
  }
]
```
