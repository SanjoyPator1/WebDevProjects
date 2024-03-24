import { app } from "./app";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => console.log(`server running at port: ${PORT}`));
