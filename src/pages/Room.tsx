import logoImg from '../assets/images/logo.svg'
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import { Button } from '../components/Button';
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode';
import { FormEvent, useEffect, useState } from 'react';
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

type FirabaseQuestions = Record<string, {
  content: string,
  author: {
    name: string,
    avatar: string
  },
  isHighlighted: boolean,
  isAnswer: boolean
}>

type Questions = {
  id: string,
  content: string,
  author: {
    name: string,
    avatar: string
  },
  isHighlighted: boolean,
  isAnswer: boolean
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)

    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirabaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswer: value.isAnswer
        }
      })

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

  async function handleSandQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswer: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div><RoomCode code={roomId} /></div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>

        <form onSubmit={handleSandQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {
              user ? (
                <div className="user-info">
                  <img src={user.avatar} alt={user.name} />
                  <span>{user.name}</span>
                </div>
              ) : (
                <span>Para enviar uam pergunta, <button>faça seu login</button>.</span>
              )
            }
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>


      </main>
    </div>
  )
}