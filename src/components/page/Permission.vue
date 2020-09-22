<template>
    <!-- <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-warn"></i> 权限测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <h1>管理员权限页面</h1>
            <p>只有用 admin 账号登录的才拥有管理员权限，才能进到这个页面，其他账号想进来都会跳到403页面，重新用管理员账号登录才有权限。</p>
            <p>想尝试一下，请<router-link to="/login" class="logout">退出登录</router-link>，随便输入个账号名，再进来试试看。</p>
        </div>

    </div> -->
   <div class="homepage-hero-module">
    <!-- <div class="video-container">
      <div :style="fixStyle" class="filter"></div>
      <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay">
        <source src="./coverr.mp4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="PATH_TO_JPEG" alt="">
      </div>
    </div> -->
    <div>
      文章在热播剧《奋斗》中出演男二号向南，引啊中中出演男二号向南，引啊中出演男二号向南
    </div>
    <div class="test">
       <p ref="p1"> {{test1}}</p>
    </div>
    <div class="test">
      <p> {{test2}}</p>
    </div>
  </div>
</template>

<script>
    export default {
        data: function(){
            return {
                vedioCanPlay: false,
                fixStyle: '',
                test2:'',
                test1:'文章在热播剧《奋斗》中出演男二号向南，引啊中中出演男二号向南，引啊中出演男二号向南',
                test3:[],
                timer:null
            }
        },
         methods: {
           test(){
              this.$nextTick(()=>{ // 页面渲染完成后的回调
       let height= this.$refs.p1.offsetHeight;
             
              console.log(height)
                let c = this.test1.split("").pop()
                let a = this.test1
              // if(height>55){
                let b = a.split("")
                b.splice(b.length-1,1)
               this.test1 = b.join("")
              // }else{
              
                  if(height>60){
                this.test()
              }
               this.test2 = c.concat(this.test2)
    })
              
              // }
            
              
           },
            canplay() {
                this.vedioCanPlay = true
            }
        },
        mounted(){
          // clearInterval(this.timer)
          //  this.timer = setInterval(()=>{
              this.test()
            // },10000)
           
            //  window.onresize = () => {
            //         const windowWidth = document.body.clientWidth
            //         const windowHeight = document.body.clientHeight
            //         const windowAspectRatio = windowHeight / windowWidth
            //         let videoWidth
            //         let videoHeight
            //         if (windowAspectRatio < 0.5625) {
            //         videoWidth = windowWidth
            //         videoHeight = videoWidth * 0.5625
            //         this.fixStyle = {
            //             height: windowWidth * 0.5625 + 'px',
            //             width: windowWidth + 'px',
            //             'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            //             'margin-left': 'initial'
            //         }
            //         } else {
            //         videoHeight = windowHeight
            //         videoWidth = videoHeight / 0.5625
            //         this.fixStyle = {
            //             height: windowHeight + 'px',
            //             width: windowHeight / 0.5625 + 'px',
            //             'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            //             'margin-bottom': 'initial'
            //         }
            //         }
            //     }
            //     window.onresize()
                }
        
    }
</script>

<style scoped>
h1{
    text-align: center;
    margin: 30px 0;
}
p{
    line-height: 30px;
    margin-bottom: 10px;
    text-indent: 2em;
}
.test{
  width:200px;height:55px;border:1px solid #ccc;
  /* word-wrap: break-word; */
  overflow: hidden;
 
  float: left;
}
.test p {
  word-wrap: break-word;
}
.logout{
    color: #409EFF;
}
.homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
  }
</style>