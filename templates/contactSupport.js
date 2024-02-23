const contactSupport = (name, email, message) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>

        <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
    </head>
    <body>

    <table>
        <thead>
            <tr>
                <th>Information</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>name</td>
            <td>${name}</td>
        </tr>

        <tr>
            <td>email</td>
            <td>${email}</td>
        </tr>

        <tr>
            <td>message</td>
            <td>${message}</td>
        </tr>
        </tbody>
    </table>
    </body>
    </html>`;
};

module.exports = contactSupport;
