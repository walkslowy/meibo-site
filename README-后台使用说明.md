# MEIBO 网站 · 后台使用说明

这是带「在线后台」的版本。登录 `/admin` 后，可以像发朋友圈一样：

- 换首页 Hero 海报、关于我们配图
- 改首页标题、导语、数据徽章
- 增删改产品（名称、描述、产品图）
- 增删改新闻（标题、日期、摘要、配图）
- 改联系方式

保存（Publish）后，Netlify 会自动更新网站，通常 1 分钟内生效。

---

## 一、上线（一次性配置）

### 1. 放到 GitHub
1. 注册 github.com，新建一个仓库（Repository），名字随意，比如 `meibo-site`。
2. 把 `meibo-cms` **文件夹里的全部内容**上传到仓库根目录（不要再多套一层文件夹）。
   - 网页上传：仓库页 → Add file → Upload files → 拖入所有文件 → Commit。
   - 必须包含：`admin/`、`content/`、`assets/`、`index.html` 等。

### 2. 连接 Netlify
1. 注册 netlify.com → **Add new site → Import an existing project → GitHub** → 选刚才的仓库。
2. Build command 留空；Publish directory 填 `.`。
3. 点 Deploy，等 1 分钟，得到一个 `xxx.netlify.app` 网址 —— 网站已上线。

### 3. 开启后台登录（关键）
在 Netlify 该站点后台，依次操作：
1. **Integrations → Identity → Enable Identity**。
2. Identity 里 **Registration → Invite only**（只允许你邀请的人登录）。
3. **Services → Git Gateway → Enable Git Gateway**。
4. **Identity → Invite users**，填你的邮箱，发送邀请。
5. 打开邮件里的链接，设置密码。

### 4. 进入后台
访问 `https://你的网址/admin`（例如 `https://meibo.netlify.app/admin`），用刚设置的账号登录。
左侧会看到三块：「站点设置 / 首页海报」「产品」「新闻」。

> 登录后提示无权限：确认第 3 步 Git Gateway 已开启，且邮箱已被邀请。

---

## 二、日常怎么改

### 换首页海报
站点设置 → 首页 Hero → **Hero 海报（上传图片）** → 上传 → Publish。
建议：横向 1920×1080，JPG，< 500KB。

### 换产品图
产品 → 产品列表 → 对应产品 → **产品图** → 上传 → Publish。
建议：正方形 800×800，< 300KB。

### 换新闻配图
新闻 → 新闻列表 → 对应新闻 → **配图** → 上传 → Publish。

### 改文字
直接在对应输入框改，Publish 即可。

---

## 三、注意事项
- **分支名**：`admin/config.yml` 里 `branch: main`。若你的 GitHub 默认分支叫 `master`，请改成 `master`，否则保存失败。
- **图片存哪**：上传的图片自动存到 `assets/img/uploads/`，页面会自动引用。
- **只改内容字段**，不要在后台改网站结构，避免格式错乱。
- 首次上传图片后，GitHub 仓库里才会出现 `assets/img/uploads/` 文件夹，正常。
- 本地直接双击 HTML（file://）时后台不生效、页面显示内置静态内容，属正常；部署到 Netlify 后才会读 `content/*.json`。

---

## 四、常见问题

**Q：打开网址显示 "Page not found / 网站不存在"？**
A：发布目录指向错了。到 Netlify 站点后台 → Site configuration → Build & deploy → Build settings，检查 **Publish directory**：
- 如果 GitHub 仓库根目录直接就是 `index.html`、`assets`、`content` 这些文件 → Publish directory 填 `.`；
- 如果仓库根目录只有一个 `meibo-cms` 文件夹（所有文件都在它里面）→ Publish directory 填 `meibo-cms`。
改完到 **Deploys → Trigger deploy → Clear cache and deploy site** 重新发布。

**Q：打开网站能看到排版但全是色块、没有照片？**
A：说明文件都传对了，只是图片还没上传。现在站点已内置一套 AI 占位图（`assets/img/`），部署后即可看到；想换成实拍图，在后台对应位置上传即可覆盖。

**Q：登录页一直转圈？**
A：确认 Netlify 已开启 Identity + Git Gateway，且用 https 访问 `/admin`。

**Q：Publish 后网站没变？**
A：等 1 分钟；或到 Netlify 的 Deploys 查看是否构建成功。

**Q：还想加中英文切换？**
A：可以后续加 i18n 字段，告诉我即可。
