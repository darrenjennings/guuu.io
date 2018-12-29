<template>
  <div class="bio-wrapper">
    <div class="bio">
      <Avatar class="avatar" />
      <div class="bio-text">
        Thanks for reading! I'm Darren Jennings. I live in San Francisco, but am a
        Kentuckian at heart. You can follow me on
        <a
          target="_blank"
          href="https://www.twitter.com/darrenjennings"
        >twitter
          <OutboundLink/>
        </a> or find out more about me <router-link to="/about/">here</router-link>.
      </div>
    </div>
  </div>
</template>

<style scoped>
.bio-wrapper {
  background-color:  hsl(220, 12%, 97%);
}
.bio {
  max-width: var(--content-width, 640px);
  margin: 0 auto;
  display: flex;
  padding: 2rem;
  margin-bottom: 0;
}
.bio-text {
  font-size: .9rem;
  font-weight: 400;
  padding: 0.25rem 0;
}

a:hover {
  color: #3574FF;
}

.avatar {
  padding-right: 1rem;
}

</style>
