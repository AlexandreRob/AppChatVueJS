<template>
  <div v-if="!joined" class="parent-container">
    <div class="home-container">
      <h3>Bienvenue</h3>
      <input type="text" class="user-name" v-model="currentUser" />
      <button class="join-button" v-on:click="join">Join</button>
    </div>
  </div>

  <div class="chat-container" v-if="joined">
    <div class="users-bar">
      <h4>Utilisateurs connectés :</h4>
      <ul>
        <li v-for="user in users" :key="user">{{ user }}</li>
      </ul>
    </div>

    <div class="messages" ref="messageList">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', { mine: message.user === currentUser }]"
      >
        <div class="bubble">
          <div class="top">
            <span class="user">{{ message.user === currentUser ? 'Moi' : message.user }}</span>
            <!-- <span class="time">{{ message.time }}</span> -->
            <!-- ajouter l'heure au message -->
          </div>
          <div class="text">{{ message.text }}</div>
        </div>
      </div>
    </div>

    <div class="text-input-container">
      <textarea
        v-model="text"
        class="text-message"
        placeholder="Tape ton message et appuie sur Entrée"
        @keyup.enter.exact.prevent="sendMessage"
      ></textarea>
      <button class="leave-button" @click="leave">Quitter</button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  data() {
    return {
      joined: false,
      currentUser: '',
      text: '',
      messages: [],
      users: []
    }
  },
  methods: {
    join() {
      if (this.currentUser.trim() === '') return
      localStorage.setItem('chatUser', this.currentUser) // Sauvegarde user
      this.joined = true
      this.socketInstance = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000')

      this.socketInstance.emit('join', this.currentUser)

      this.socketInstance.on('users:update', (userList) => {
        this.users = userList
      })

      this.socketInstance.on('message:received', (data) => {
        this.messages = this.messages.concat(data)
        this.$nextTick(() => {
          this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight
        })
      })
    },
    sendMessage() {
      if (this.text.trim() === '') return
      this.addMessage()
      // console.log(this.text);
      this.text = ''
    },
    addMessage() {
      const now = new Date()

      const message = {
        id: now.getTime(),
        text: this.text,
        user: this.currentUser,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      this.messages = this.messages.concat(message)

      this.socketInstance.emit('message', message)

      this.$nextTick(() => {
        const container = this.$refs.messageList
        container.scrollTop = container.scrollHeight
      })
    },
    mounted() {
      const savedUser = localStorage.getItem('chatUser')
      if (savedUser) {
        this.currentUser = savedUser
        this.join() // Auto-connexion si déjà identifié
      }
    },
    leave() {
      if (this.socketInstance) {
        this.socketInstance.disconnect() // Ferme proprement
        this.socketInstance = null
      }
      localStorage.removeItem('chatUser')
      this.joined = false
      this.messages = []
      this.users = []
      this.currentUser = ''
    }
  },

  name: 'ChatApp'
}
</script>

<style scoped>
* {
  font-family: 'Inter', sans-serif;
}
.parent-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  padding-top: 150px;
}

.home-container {
  display: flex;
  flex-direction: column;
  width: 200px;
  text-align: center;
}

.user-name {
  height: 30px;
  font-size: 20px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
  font-weight: bold;
}

.join-button {
  height: 30px;
  font-size: 20px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f0f2f5;
}

.message {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.message.mine {
  justify-content: flex-end;
}

.bubble {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 15px;
  background-color: #e4e6eb;
  color: #000;
  position: relative;
  font-size: 14px;
  line-height: 1.4;
}

.message.mine .bubble {
  background-color: #007bff;
  color: #fff;
}

.user {
  display: block;
  font-weight: bold;
  margin-bottom: 4px;
}

.text-input-container {
  border-top: 1px solid #ccc;
  padding: 10px;
  background-color: white;
}

.text-message {
  width: 100%;
  height: 50px;
  resize: none;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
}
.users-bar {
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.users-bar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.users-bar li {
  padding: 2px 0;
  font-size: 14px;
}
.leave-button {
  background-color: #ff4d4d;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  margin: 10px;
  cursor: pointer;
}
.leave-button:hover {
  background-color: #e60000;
}
</style>
