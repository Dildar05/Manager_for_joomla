function cleanName(name) {
	name = name.replace(/жж/g, 'оқу жылы').replace(/о\.ж/g, 'оқу жылы')
	name = name.replace(/-/g, ' - ')
	return name.charAt(0).toUpperCase() + name.slice(1)
}

function generateTable() {
	const directoryInput = document.getElementById('directoryPicker')
	const mediaManagerPath = document.getElementById('mediaManagerPath').value
	const siteType = parseInt(document.getElementById('siteType').value)
	const managerType = parseInt(document.getElementById('managerType').value)

	if (directoryInput.files.length === 0) {
		alert('Пожалуйста, выберите директорию.')
		return
	}

	let files = Array.from(directoryInput.files).filter(
		file => file.name.toLowerCase() !== 'desktop.ini'
	)
	let fileInfo = files.map(file => {
		let ext = file.name.split('.').pop().toUpperCase()
		let name = cleanName(file.name.replace(/\.[^/.]+$/, ''))
		return { name, ext }
	})

	let tableHtml = `
    <table class="cwd">
    <thead>
    <tr>
    <th>№</th>
    <th>Название</th>
    <th>Скачать</th>
    </tr>
    </thead>
    <tbody>
    `

	fileInfo.forEach((file, idx) => {
		const fullPath = `${mediaManagerPath}/${idx + 1}.${file.ext.toLowerCase()}`
		const manager = managerType !== 1 ? 'images' : 'images-new'
		const typer =
			siteType !== 1
				? `<img src="/${manager}/dcloud.png" width="25">`
				: file.ext

		tableHtml += `
        <tr>
        <td>${idx + 1}</td>
        <td>${file.name}</td>
        <td><a href="${fullPath}" target="_blank" rel="noopener">${typer}</a></td>
        </tr>
        `
	})

	tableHtml += `
    </tbody>
    </table>
    <p> </p>
    `

	document.getElementById('output').innerHTML = tableHtml
	document.getElementById('htmlCode').textContent = tableHtml

	let outputTxtContent = fileInfo
		.map((file, idx) => `${idx + 1}: ${file.name}.${file.ext.toLowerCase()}`)
		.join('\n')
	let outputTxtBlob = new Blob([outputTxtContent], { type: 'text/plain' })
	let outputTxtUrl = URL.createObjectURL(outputTxtBlob)

	let txtDownloadLink = document.createElement('a')
	txtDownloadLink.href = outputTxtUrl
	txtDownloadLink.download = 'output.txt'
	txtDownloadLink.innerText = 'Скачать output.txt'
	document.getElementById('output').appendChild(txtDownloadLink)
}

function copyToClipboard() {
	const htmlCode = document.getElementById('htmlCode').textContent
	navigator.clipboard
		.writeText(htmlCode)
		.then(() => {
			alert('HTML код скопирован в буфер обмена')
		})
		.catch(err => {
			console.error('Ошибка копирования в буфер обмена: ', err)
		})
}
