import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  sweepstakeCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [sweepstakeTitle, setSweepstakeTitle] = useState("");

  async function createSweepstake(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/sweepstakes", {
        title: sweepstakeTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert(
        `Bolão criado com sucesso, o código foi copiado para a área de transferência:\n\n${code}`
      );
      setSweepstakeTitle("");
    } catch (err) {
      console.error(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }

  return (
    <div className="mx-auto grid h-screen max-w-[1124px] grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className="mt-14 text-5xl font-bold leading-tight text-white">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-xl text-gray-100">
            <span className="text-ignite-500 ">+{props.userCount}</span> pessoas
            já estão usando
          </strong>
        </div>

        <form onSubmit={createSweepstake} className="mt-10 flex gap-2">
          <input
            className="flex-1 rounded border border-gray-600 bg-gray-800 px-6 py-4 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual o nome do seu bolão?"
            onChange={(event) => setSweepstakeTitle(event.target.value)}
            value={sweepstakeTitle}
          />
          <button
            className="rounded bg-yellow-500 px-6 py-4 text-sm font-bold uppercase text-gray-900 hover:bg-yellow-700"
            type="submit"
          >
            criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm leading-relaxed text-gray-300">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 flex items-center justify-between border-t border-gray-600 pt-10 text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                +{props.sweepstakeCount}
              </span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="h-14 w-px bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [sweepstakeCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("sweepstakes/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      sweepstakeCount: sweepstakeCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
