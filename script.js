function cleanName(name) {
	// Замены для 'ож', 'жж', и 'о.ж'
	name = name
		.replace(/жж/g, 'оқу жылы')
		.replace(/о\.ж/g, 'оқу жылы')
		.replace(/ож/g, 'оқу жылы')

	// Регулярное выражение для поиска года перед 'оқу жылы'
	const yearPattern = /(\d{2})-(\d{2})(?=\s*оқу жылы)/g

	// Замена для корректного года
	name = name.replace(yearPattern, '20$1-20$2')

	// Замена '-' на ' - '
	name = name.replace(/-/g, ' - ')

	// Возвращаем строку с заглавной буквы
	return name.charAt(0).toUpperCase() + name.slice(1)
}

function generateTable() {
	const fileInput = document.getElementById('filePicker')
	let mediaManagerPath = document.getElementById('mediaManagerPath').value
	const siteType = parseInt(document.getElementById('siteType').value)
	const managerType = parseInt(document.getElementById('managerType').value)
	const languageType = parseInt(document.getElementById('langType').value)

	// Удаление всех конечных слэшей из пути
	mediaManagerPath = mediaManagerPath.replace(/\/+$/, '')

	// Проверка, выбраны ли файлы
	if (fileInput.files.length === 0) {
		alert('Пожалуйста, выберите файлы.')
		return
	}

	// Получение информации о файлах в порядке, в котором они выбраны пользователем
	let files = Array.from(fileInput.files).filter(
		file => file.name.toLowerCase() !== 'desktop.ini'
	)

	let fileInfo = files.map(file => {
		let ext = file.name.split('.').pop().toUpperCase()
		let name = cleanName(file.name.replace(/\.[^/.]+$/, ''))
		return { name, ext }
	})

	// Определение названий столбцов в зависимости от языка
	let name = ''
	let down = ''
	if (languageType === 1) {
		name = 'Атауы'
		down = 'Жүктеу'
	} else {
		name = 'Название'
		down = 'Скачать'
	}

	// Начало формирования HTML таблицы
	let tableHtml = `
                <table class="cwd" style="width: 100%;" border="1">
                <thead>
                <tr>
                <th style="background-color: #00b5fc; text-align: center; width: 4.40639%;"><strong>№</strong></th>
                <th style="background-color: #00b5fc; text-align: center; width: 86.6979%;"><strong>${name}</strong></th>
                <th style="background-color: #00b5fc; text-align: center; width: 8.9207%;"><strong>${down}</strong></th>
                </tr>
                </thead>
                <tbody>
            `

	// Генерация строк таблицы для каждого файла в порядке, в котором они выбраны пользователем
	fileInfo.forEach((file, idx) => {
		const fullPath = `${mediaManagerPath}/${idx + 1}.${file.ext.toLowerCase()}`
		const manager = managerType !== 1 ? 'images' : 'images-new'
		const typer =
			siteType !== 1
				? `<img src="/${manager}/dcloud.png" width="25">`
				: file.ext

		tableHtml += `
                    <tr>
                    <td style="text-align: center; width: 4.40639%;">${
											idx + 1
										}</td>
                    <td style="text-align: center; width: 86.6979%;">${
											file.name
										}</td>
                    <td style="text-align: center; width: 8.9207%;"><a href="${fullPath}" target="_blank" rel="noopener">${typer}</a></td>
                    </tr>
                `
	})

	// Завершение формирования таблицы
	tableHtml += `
                </tbody>
                </table>
                <p> </p>
            `

	// Вставка HTML таблицы в элемент с id 'output'
	document.getElementById('output').innerHTML = tableHtml
	// Вставка HTML кода таблицы в элемент с id 'htmlCode' для отображения
	document.getElementById('htmlCode').textContent = tableHtml

	// Формирование содержимого для текстового файла с информацией о файлах
	let outputTxtContent = fileInfo
		.map((file, idx) => `${idx + 1}: ${file.name}.${file.ext.toLowerCase()}`)
		.join('\n')
	// Создание Blob объекта с содержимым текстового файла
	let outputTxtBlob = new Blob([outputTxtContent], { type: 'text/plain' })
	// Создание URL для скачивания текстового файла
	let outputTxtUrl = URL.createObjectURL(outputTxtBlob)

	// Создание ссылки для скачивания текстового файла
	let txtDownloadLink = document.createElement('a')
	txtDownloadLink.href = outputTxtUrl
	txtDownloadLink.download = 'output.txt'
	txtDownloadLink.innerText = 'Скачать output.txt'

	// Добавление ссылки для скачивания текстового файла в элемент с id 'output'
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
