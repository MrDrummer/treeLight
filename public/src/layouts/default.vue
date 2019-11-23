<template lang="pug">
  q-layout(view='lHh Lpr lFf')
    q-header(elevated='')
      q-toolbar
        q-toolbar-title
          | Over The Top Light Control Panel
        div Quasar v{{ $q.version }}
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'default'
}
</script>
