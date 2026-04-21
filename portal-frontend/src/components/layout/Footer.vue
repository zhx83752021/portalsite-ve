<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- 关于 -->
        <section class="f-col f-col--about">
          <div class="f-seal">门</div>
          <h3 class="f-title">综合门户</h3>
          <p class="f-desc">
            专业的综合资讯门户，聚合时政、财经、体育、娱乐、科技多领域权威内容。
          </p>
          <div class="f-social">
            <a href="#" class="f-social-btn" aria-label="微博">
              <el-icon>
                <Share />
              </el-icon>
            </a>
            <a href="#" class="f-social-btn" aria-label="微信">
              <el-icon>
                <ChatDotRound />
              </el-icon>
            </a>
            <a href="#" class="f-social-btn" aria-label="APP 下载">
              <el-icon>
                <Iphone />
              </el-icon>
            </a>
          </div>
        </section>

        <!-- 快捷导航 -->
        <section class="f-col">
          <h4 class="f-heading">频道</h4>
          <ul class="f-list">
            <li><router-link to="/news">新闻中心</router-link></li>
            <li><router-link to="/finance">财经资讯</router-link></li>
            <li><router-link to="/sports">体育赛事</router-link></li>
            <li><router-link to="/entertainment">娱乐文化</router-link></li>
            <li><router-link to="/tech">科技前沿</router-link></li>
          </ul>
        </section>

        <!-- 友情链接 -->
        <section class="f-col">
          <h4 class="f-heading">友情链接</h4>
          <ul class="f-list">
            <li><a href="https://www.gov.cn" target="_blank" rel="noopener">中国政府网</a></li>
            <li><a href="https://www.xinhuanet.com" target="_blank" rel="noopener">新华网</a></li>
            <li><a href="https://www.people.com.cn" target="_blank" rel="noopener">人民网</a></li>
            <li><a href="https://www.cctv.com" target="_blank" rel="noopener">央视网</a></li>
            <li><a href="https://www.chinadaily.com.cn" target="_blank" rel="noopener">China Daily</a></li>
          </ul>
        </section>

        <!-- 联系我们 -->
        <section class="f-col">
          <h4 class="f-heading">联系我们</h4>
          <ul class="f-list f-list--contact">
            <li>
              <el-icon>
                <Message />
              </el-icon> contact@portal.com
            </li>
            <li>
              <el-icon>
                <Phone />
              </el-icon> 400-123-4567
            </li>
            <li>
              <el-icon>
                <Location />
              </el-icon> 北京市朝阳区建国路 88 号
            </li>
            <li class="f-contact-hint">工作日 09:00–18:00</li>
          </ul>
        </section>
      </div>

      <div class="footer-bottom">
        <p class="copy">
          &copy; {{ year }} 综合门户 · CLM Portal · All rights reserved.
        </p>
        <div class="bottom-links">
          <a href="#">隐私政策</a>
          <span>·</span>
          <a href="#">服务条款</a>
          <span>·</span>
          <a href="#">网站地图</a>
          <span>·</span>
          <span class="icp">ICP 备 XXXXXX 号</span>
          <span>·</span>
          <span class="icp">公安备案 1101000000000</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Share, ChatDotRound, Iphone, Message, Phone, Location } from '@element-plus/icons-vue'
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--brand-navy-900);
  color: rgba(255, 255, 255, 0.72);
  padding: 56px 0 20px;
  margin-top: auto;
  position: relative;
}

.site-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--brand-red);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.f-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.f-seal {
  width: 44px;
  height: 44px;
  border: 2px solid rgba(255, 255, 255, 0.32);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 4px;
}

.f-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  margin: 0;
  letter-spacing: 0.06em;
}

.f-desc {
  font-size: var(--fs-meta);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.f-heading {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
  letter-spacing: 0.1em;
  position: relative;
  padding-bottom: 12px;
}

.f-heading::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 24px;
  height: 2px;
  background: var(--brand-gold);
}

.f-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.f-list li {
  font-size: var(--fs-meta);
  color: rgba(255, 255, 255, 0.72);
  display: flex;
  align-items: center;
  gap: 8px;
}

.f-list a {
  color: rgba(255, 255, 255, 0.72);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
}

.f-list a:hover {
  color: var(--brand-gold);
}

.f-list--contact .el-icon {
  color: var(--brand-gold);
  font-size: 14px;
}

.f-contact-hint {
  color: rgba(255, 255, 255, 0.4);
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
}

.f-social {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.f-social-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.f-social-btn:hover {
  background: var(--brand-gold);
  color: var(--brand-navy-900);
}

.footer-bottom {
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.copy {
  margin: 0;
  font-size: var(--fs-meta);
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-mono);
}

.bottom-links {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  font-size: var(--fs-meta);
}

.bottom-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.bottom-links a:hover {
  color: #fff;
}

.bottom-links span {
  color: rgba(255, 255, 255, 0.3);
}

.icp {
  font-family: var(--font-mono);
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
}

@media (max-width: 640px) {
  .site-footer {
    padding: 40px 0 16px;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
