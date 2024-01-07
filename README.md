Chạy các lệnh sau để cài thư viện:
npm init
npm i -D express mongoose moment shortid express-session ejs multer dotenv nodemon bcrypt
npm i mqtt --save

Thêm dòng sau vào script trong package.json:
"start": "nodemon index.js"

Tạo 1 file .env với nội dung:
PORT = 5000
MONGO_URI = mongodb+srv://duong:duong12345@cluster0.di8d9l2.mongodb.net/?retryWrites=true&w=majority

Chạy lệnh sau để bắt đầu: npm start
Web sẽ chạy trên cổng http://localhost:5000/

Nếu có bất cứ vấn đề gì, xin liên hệ với mình qua email:
duong.nnb204734@sis.hust.edu.vn 
Hoặc nhắn tin qua Teams để mình hỗ trợ ạ
