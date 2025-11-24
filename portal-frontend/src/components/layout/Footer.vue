<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <!-- 网站信息 -->
        <div class="footer-section">
          <h3>关于我们</h3>
          <p>专业的综合门户网站，提供新闻、财经、体育、娱乐等多领域资讯服务。</p>
          <div class="social-links">
            <el-button circle :icon="Share" size="small" />
            <el-button circle size="small">
              <el-icon><ChatDotRound /></el-icon>
            </el-button>
            <el-button circle size="small">
              <el-icon><Iphone /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 快捷链接 -->
        <div class="footer-section">
          <h3>快捷导航</h3>
          <ul class="footer-links">
            <li><router-link to="/news">新闻中心</router-link></li>
            <li><router-link to="/finance">财经资讯</router-link></li>
            <li><router-link to="/sports">体育赛事</router-link></li>
            <li><router-link to="/entertainment">娱乐八卦</router-link></li>
            <li><router-link to="/tech">科技前沿</router-link></li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div class="footer-section">
          <h3>联系我们</h3>
          <ul class="footer-links">
            <li><el-icon><Message /></el-icon> contact@portal.com</li>
            <li><el-icon><Phone /></el-icon> 400-123-4567</li>
            <li><el-icon><Location /></el-icon> 北京市朝阳区</li>
          </ul>
        </div>

        <!-- 友情链接 -->
        <div class="footer-section">
          <h3>友情链接</h3>
          <ul class="footer-links">
            <li><a href="#" target="_blank">合作伙伴1</a></li>
            <li><a href="#" target="_blank">合作伙伴2</a></li>
            <li><a href="#" target="_blank">合作伙伴3</a></li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="footer-bottom">
        <p>&copy; 2024 门户网站. All rights reserved.</p>
        <div class="footer-links-inline">
          <a href="#">隐私政策</a>
          <span>|</span>
          <a href="#">服务条款</a>
          <span>|</span>
          <a href="#">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Share, ChatDotRound, Iphone, Message, Phone, Location } from '@element-plus/icons-vue'
</script>

<style scoped lang="css">
.site-footer {
  background: #303133;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #409EFF;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
  color: #909399;
  margin-bottom: 15px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.footer-links a {
  color: #909399;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #409EFF;
}

.footer-bottom {
  border-top: 1px solid #606266;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.footer-bottom p {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.footer-links-inline {
  display: flex;
  gap: 10px;
  align-items: center;
}

.footer-links-inline a {
  color: #909399;
  text-decoration: none;
  font-size: 14px;
}

.footer-links-inline a:hover {
  color: #409EFF;
}

.footer-links-inline span {
  color: #606266;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
