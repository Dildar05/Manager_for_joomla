import os

# Запрос директории у пользователя
path = input("Введите путь к директории: ")
pathh = input("Введите каталог медиа менеджера: ")
sitetype = int(input("1:Подсайт\n2:Сайт"))
managertype=int(input("1:images-new\n2:images"))

# Проверка существования директории
if not os.path.exists(path):
    print("Директория не существует.")
else:
    # Создание папки для сохранения файлов
    output_folder = os.path.join(path, 'output')
    os.makedirs(output_folder, exist_ok=True)

    # Получение списка файлов в директории
    files = os.listdir(path)

    # Фильтрация только файлов (исключение директорий и файлов, связанных с десктопом)
    files = [f for f in files if os.path.isfile(os.path.join(path, f)) and f.lower() != 'desktop.ini']

    # Количество файлов
    file_count = len(files)

    # Функция очистки и форматирования имени файла
    def clean_name(name):
        name = name.replace('жж', 'оқу жылы').replace('о.ж', 'оқу жылы')
        name = name.replace('-', ' - ')
        return name.capitalize()

    # Получение названий файлов и их расширений без точки, замена дефисов и перевод первой буквы в верхний регистр
    file_info = [(clean_name(os.path.splitext(f)[0]), os.path.splitext(f)[1][1:].upper()) for f in files]

    # Вывод количества файлов
    print(f"Количество файлов: {file_count}")

    # Формирование HTML таблицы
    table_html = '''
    <table class="cwd" style="width: 100%;" border="1">
    <thead>
    <tr>
    <th style="background-color: #00b5fc; text-align: center; width: 4.40639%;"><strong>№</strong></th>
    <th style="background-color: #00b5fc; text-align: center; width: 86.6979%;"><strong>Название</strong></th>
    <th style="background-color: #00b5fc; text-align: center; width: 8.9207%;"><strong>Скачать</strong></th>
    </tr>
    </thead>
    <tbody>
    '''

    for idx, (name, ext) in enumerate(file_info, start=1):
        full_path = os.path.join(pathh, f"{idx}.{ext.lower()}")
        manager=("")
        if managertype !=(1):
            manager=("images")
        else:
            manager=("images-new")
        typer= ("")
        if sitetype != (1):
            typer=(f'<img src="/{manager}/dcloud.png" width="25">')
        else:
            typer=ext
        
        table_html += f'''
        <tr>
        <td style="text-align: center; width: 4.40639%;">{idx}</td>
        <td style="text-align: center; width: 86.6979%;">{name}</td>
        <td style="text-align: center; width: 8.9207%;"><a href="{full_path}" target="_blank" rel="noopener">{typer}</a></td>
        </tr>
        '''


    table_html += '''
    </tbody>
    </table>
    <p> </p>
    '''

    # Сохранение HTML таблицы в файл
    output_html_file = os.path.join(output_folder, 'output.html')
    with open(output_html_file, 'w', encoding='utf-8') as html_file:
        html_file.write(table_html)

    print(f"HTML таблица сохранена в файл: {output_html_file}")

    # Сохранение информации в текстовый файл
    output_txt_file = os.path.join(output_folder, 'output.txt')
    with open(output_txt_file, 'w', encoding='utf-8') as txt_file:
        for idx, (name, ext) in enumerate(file_info, start=1):
            txt_file.write(f"{idx}: {name}.{ext.lower()}\n")

    print(f"Информация сохранена в текстовый файл: {output_txt_file}")