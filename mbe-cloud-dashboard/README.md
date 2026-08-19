# MBE - Cloud Infra Dashboard (Full Stack) 

The **MBE Cloud Infra Dashboard** is a premium, lightweight, secure application engineered to manage the lifecycle of your Amazon EC2 instances. Moving from a client-side architecture to a **Node.js & Express** backend ensures your AWS credentials (`Access Keys`) and critical configurations remain safe on the server side, away from the browser console.

---

##  System Architecture

The application splits cleanly into two layers:
- **Backend (Node.js/Express)**: Serves web pages, securely houses the `INSTANCE_ID`, hooks directly into the official `@aws-sdk/client-ec2`, and authenticates locally using default environment variables.
- **Frontend (Tailwind CSS)**: A high-fidelity, cyberpunk-inspired visual dashboard designed with sleek glassmorphism panels, interactive glow effects, and asynchronous API communication.

---

##  Directory Layout

To run this application properly, organize your files into the structure below:

```text
mbe-cloud-dashboard/
├── public/
│   └── index.html        # Front-end UI (Served automatically by Express)
├── package.json          # Node.js project manifest & application configuration
└── server.js             # Core Server Back-end (Express API + AWS Client integration)
```

---

##  Main Stack

- **Runtime & Framework**: Node.js (Configured natively with Modern ES Modules) and Express.
- **UI Platform**: Core Tailwind CSS loaded over production-grade CDNs.
- **Infrastructure Provider**: AWS SDK for JavaScript v3 (`@aws-sdk/client-ec2`).

---

##  Installation & Local Launch

Follow these swift instructions to build and launch your instance controller:

### 1. File Configuration
Make sure your local directory structure matches the layout in the **Directory Layout** section above.

### 2. Configure AWS Identity Check
The AWS Client naturally looks for global configuration files on your server or laptop. Ensure you have run:
```bash
aws configure
```
Alternatively, make sure your machine possesses the proper environment parameters defined: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### 3. Fetch System Modules
Open your terminal inside the root directory of your project folder and invoke the deployment package tool:
```bash
npm install
```

### 4. Execute Web Server
Spin up the internal server instance with standard Node execution:
```bash
node server.js
```

The system interface will print confirmation to your screen:
> `Painel JavaScript rodando em: http://localhost:3000`

Fire up your preferred internet browser and visit `http://localhost:3000` to manipulate your infrastructure matrix.

---

##  Core API Endpoints

The frontend client updates and commands the cloud network through these lightweight system endpoints:

| Route Path | Type | Intent | Output Payload |
| :--- | :--- | :--- | :--- |
| `/api/status` | `GET` | Fetches state of current EC2 instance from AWS cloud data centers. | `{ "status": "running" \| "stopped" }` |
| `/api/ligar` | `POST` | Dispatches internal initialization commands to fire up server. | `{ "message": "Comando enviado..." }` |
| `/api/desligar` | `POST` | Triggers immediate graceful shutdown procedures. | `{ "message": "Comando enviado..." }` |

---

##  Cloud Authorization Best Practices

- **IAM Restrictions**: Always map a distinct user entity inside the AWS Identity Management portal. Do not use corporate main accounts or Root credentials.
- **Role Allocation**: If you run this service on an actual AWS server environment (like a small EC2 or Elastic Beanstalk instance), never hardcode passwords. Assign an **IAM Instance Profile / Role** directly to your instance containing policy configurations for `ec2:DescribeInstances`, `ec2:StartInstances`, and `ec2:StopInstances`.

---

<p align="center">
  Developed by <b>Allan - MBE Engineering</b> Core Platform
</p>
