<template>
    <div id="BodyCon" style="margin-top: 85px">
        <!--        公告-->
        <div class="box" id="box_notice">
            <!--        公告部分-->
            <div>
                <p style="padding-bottom: 10px">网站公告</p>
                <hr>
                <div class="notice_data" id="notice_data" style="margin-top: 10px">
                    <!--                  开始-->
                    <strong><span
                        style="color:#E53333; text-align: center">本网站【插件&代码】仅用于学习和调试使用，禁止用于任何违法犯罪行为</span></strong><br>
                    <!--                  结束-->
                </div>
            </div>
        </div>
        <!--        插件列表-->
        <div class="mdui-card mt box" style="border-radius:15px;margin-top: 20px;">
            <div class="mdui-card-primary">
                <div class="mdui-card-primary-title">插件列表</div>
                <div class="mdui-card-primary-subtitle">Plugin List</div>
            </div>
            <div class="mdui-card-menu">
                <button mdui-dialog="{target: '#pluginUpload'}" class="mdui-btn mdui-btn-dense mdui-btn-raised btn mdui-p-x-1 mdui-color-blue-grey mdui-text-color-white">
                    <i class="mdui-icon mdui-icon-left material-icons">file_upload</i>上传插件
                </button>
            </div>
            <div class="mdui-table-fluid" style="border-radius:7px">
                <table class="mdui-table mdui-table-hoverable">
                    <thead>
                    <tr>
                        <th>文件名称</th>
                        <th>插件名称</th>
                        <th>更新日期</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="d in AllData" :key="d">
                        <th>{{d.FileName}}</th>
                        <th>{{d.PluginName}}</th>
                        <th>{{d.FileUploadTime}}</th>
                        <th>
                            <button @click="DownloadFile(d.FileName)" class="mdui-btn mdui-btn-dense mdui-btn-raised btn mdui-p-x-1 mdui-color-blue mdui-text-color-white">
                                <i class="mdui-icon mdui-icon-left material-icons">file_download</i>
                                下载插件
                            </button>
                        </th>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!--        上传插件-->
        <div id="pluginUpload" class="mdui-dialog" style="top: 210px; display: none;">
            <div class="mdui-dialog-title">上传插件</div>
            <div class="mdui-dialog-content mdui-typo" style="height: 407px;">
                <div class="mdui-textfield mdui-textfield-floating-label">
                    <i class="mdui-icon material-icons">lock</i>
                    <input type="password" class="mdui-textfield-input" placeholder="上传密码（必填）" v-model="UpPWD" />
                </div>
                <br><br>
                <input type= "file" @change="UpdateFile" id="pluginFile" accept="application/javascript"/>
                <div class="mdui-dialog-actions">
                    <button @click="SendFile" class="mdui-btn mdui-color-green-700 mdui-text-color-white btn" mdui-dialog-close>
                        执行操作
                    </button>
                </div>
            </div>
        </div>
        <!--        成功提示-->
        <div id="SendOK" class="mdui-dialog" style="display: none;">
            <div class="mdui-dialog-title">上传提示</div>
            <div class="mdui-dialog-content">插件上传成功</div>
            <div class="mdui-dialog-actions">
                <a href="javascript:location.reload();">
                    <button class="mdui-btn mdui-ripple" mdui-dialog-close>确认</button>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import mdui from "mdui";
import fileDownload from 'js-file-download'
export default {
    name: "BodyCom",
    data(){
        return {
            AllData: [{
                FileName: "",
                PluginName: "",
                FileUploadTime: ""
            }],
            File: [],
            UpPWD: "",
        }
    },
    methods: {
        // 修改底栏高度状态
        changeStyle() {
            let container = document.querySelector("#BodyCon");
            container.style.minHeight = window.innerHeight - document.body.clientHeight + container.clientHeight +
                'px';
            mdui.mutation();
        },
        // 获取网站所有信息
        GetWebAllData(){
            axios.get("/web/all").then((res) => {
                switch (res.data !== "") {
                    case res.data.code === 200:
                        // 添加成功
                        document.getElementById("notice_data").innerHTML = res.data['notice']
                        this.AllData = res.data['pluginList']
                        break
                    case res.data.code === 500:
                        // 变量名已存在
                        mdui.snackbar({
                            message: '系统发生错误，请管理员查看运行日志',
                            position: 'right-top',
                        });
                        break
                }
            }).catch((error) => {
                // 请求失败
                mdui.snackbar({
                    message: error,
                    position: 'right-top',
                });
            })
        },
        // 获取File文件对象
        UpdateFile(e){
            this.File = e.target.files[0]
        },
        // 发送文件
        SendFile(){
            let inst = new mdui.Dialog('#SendOK');
            let param = new FormData();
            param.append("file", this.File);
            // 发送
            axios.post("/file/upload?pwd=" + this.UpPWD, param).then((res => {
                switch (res.data !== "") {
                    case res.data.code === 200:
                        inst.toggle()
                        break
                    case res.data.code === 400:
                        mdui.snackbar({
                            message: "上传密码错误",
                            position: 'right-top',
                        });
                        break
                    case res.data.code === 500:
                        mdui.snackbar({
                            message: "系统发生错误，请管理员查看运行日志",
                            position: 'right-top',
                        });
                        break
                }
            })).catch((err) => {
                mdui.snackbar({
                    message: err,
                    position: 'right-top',
                });
            })
        },
        // 下载插件
        DownloadFile(filename){
            // 获取下载地址
            axios.get("/file/download?filename=" + filename).then((res) => {
                fileDownload(res.data, filename)
            }).catch((err) => {
                mdui.snackbar({
                    message: err,
                    position: 'right-top',
                });
            })
        }
    },
    mounted() {
        this.changeStyle()
        this.GetWebAllData()
    }
}
</script>

<style scoped>
.box {
    margin: 0 auto;
    width: 61.8%;
    padding: 30px;
    background: rgba(250, 249, 249, .8);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgb(60 64 67 / 25%);
    border-radius: 15px;
}

@media screen and (max-width:912px) {
    .box {
        width: 80%;
    }
}

@media screen and (max-width:540px) {
    .box {
        width: 500px;
    }
}

@media screen and (max-width:420px) {
    .box {
        width: 360px;
    }
}

@media screen and (max-width:375px) {
    .box {
        width: 330px;
    }
}

@media screen and (max-width:280px) {
    .box {
        width: 255px;
    }
}
</style>
