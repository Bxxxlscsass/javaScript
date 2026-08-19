# MBE - Cloud Infra Dashboard 

The **MBE Cloud Infra Dashboard** is a premium, lightweight, and serverless web interface developed for the direct management of Amazon EC2 instances. Featuring a modern, cyberpunk-inspired visual identity, the dashboard eliminates the need for intermediary servers or complex build tools by connecting the browser directly to the AWS API using modern ES modules.

---

##  Features

- **Secure Direct-to-AWS Authentication**: Connection established directly from the client to AWS endpoints using the provided credentials.
- **State Management**: Built-in commands to quickly **Start** and **Stop** a specific EC2 instance.
- **Real-Time Monitoring**: A dynamic visual indicator that displays the server's current status.
- **Cyberpunk & Responsive Design**: A sleek interface built with Tailwind CSS, glassmorphism effects, neon pulse animations, and abstract background blurs.
- **Cache Security**: A dedicated option to clear saved credentials from the browser cache with a single click.

---

##  Technologies Used

The project adopts a modern and minimalist architecture that runs natively in today's web ecosystem:

- **HTML5 & CSS3** (with custom animations)
- **[Tailwind CSS](https://tailwindcss.com)**: A utility-first framework for fast and responsive styling.
- **[AWS SDK for JavaScript (v3)](https://github.com)**: Specifically the `@aws-sdk/client-ec2` client for infrastructure service communication.
- **[esm.sh](https://esm.sh)**: A performance-focused global CDN used to load NPM packages as native modules (ESM) directly in the browser via `importmap`, without requiring local installation steps or package managers (such as npm or yarn).

---

##  How to Run the Project

Since the application is completely client-based and serverless, **there is no need to install any dependencies or run build commands.**

1. Download or copy the code from the `index.html` file.
2. Open the file directly in any modern web browser of your choice (e.g., Google Chrome, Brave, Microsoft Edge, Mozilla Firefox, or Safari).
3. If you prefer a structured local development environment, you can serve the file using extensions like *Live Server* in VS Code or via the terminal:
   ```bash
   # Using Python to launch a quick server on port 8000
   python -m http.server 8000
   ```

---

##  How to Use

Upon opening the application, you will be greeted by a secure authentication wall. Enter the following data to initialize the control console:

1. **Cloud Region**: The AWS region identifier where your server is hosted (e.g., `us-east-1`, `sa-east-1`).
2. **EC2 Instance ID**: The identification code of your virtual machine (e.g., `i-0123456789abcdef0`).
3. **AWS Access Key ID**: Your access key generated via the AWS IAM console.
4. **AWS Secret Access Key**: Your corresponding secret key.

After filling out the information, click **"Inicializar Conexão Segura"** (Initialize Secure Connection) to unlock the main control matrix and manage your server's lifecycle.

---

##  Security Recommendations

- **Principle of Least Privilege (IAM)**: To protect your account, it is highly recommended to create a dedicated user in the AWS IAM panel with strict permissions limited to interacting with the desired instance. Avoid using root or master administrator keys.
- **Example of a recommended IAM policy**:
  ```json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "ec2:DescribeInstances",
                  "ec2:StartInstances",
                  "ec2:StopInstances"
              ],
              "Resource": "arn:aws:ec2:YOUR_REGION:YOUR_ACCOUNT:instance/YOUR_INSTANCE_ID"
          }
      ]
  }
  ```

---

<p align="center">
  Developed by <b>Allan - MBE Engineering</b> Core Platform
</p>

