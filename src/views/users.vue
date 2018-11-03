<template>
    <!-- 卡片容器 -->
    <el-card class="box-card">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row>
            <el-col :span="10">
                <el-input clearable v-model="searchVal" placeholder="请输入内容" class="input-with-select">
                    <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="5">
                <el-button @click="showDiaAddUser()" type="primary">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 添加的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
            <el-form :model="formData">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="formData.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formData.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdduser = false">取消</el-button>
                <el-button type="primary" @click="addUser()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 编辑的对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
            <el-form :model="formData">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="formData.username" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formData.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdituser = false">取消</el-button>
                <el-button type="primary" @click="editUser()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="list" style="width: 100%">
            <el-table-column label="#" width="80" type="index">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="120">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="电话">
            </el-table-column>
            <el-table-column label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtDate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态">
                <template slot-scope="scope">
                    <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" :plain="true" @click="showEditdia(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" :plain="true"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" :plain="true" @click="showDelefirm(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]"
            :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </el-card>
</template>
<script>
    export default {
        mounted() {
            this.loadTableData()
        },
        methods: {
            // 编辑用户  -- 发送请求
            async editUser() {
                this.dialogFormVisibleEdituser = false
                // console.log(this.currUserId);
                const res = await this.$http.put(`users/${this.currUserId}`, this.formData)
                // console.log(res);
                const { meta: { status, msg } } = res.data
                if (status === 200) {
                    this.$message.success(msg)
                }
            },
            // 编辑用户  == 渲染表格
            showEditdia(user) {
                // console.log(user)
                this.dialogFormVisibleEdituser = true
                this.formData = user
                this.currUserId = user.id
            },
            // 添加用户  - -表单提交
            async addUser() {
                // 关闭对话框
                this.dialogFormVisibleAdduser = false
                // 发送post  传数据
                const res = await this.$http.post('users', this.formData)
                console.log(res)
                const { meta: { msg, status } } = res.data
                if (status === 201) {
                    // 清空对话框

                    // ①   this.formData = {}
                    // ②   this.formData.username = ''
                    //     this.formData.password = ''
                    //     this.formData.email = ''
                    //     this.formData.mobile = ''
                    for (const key in this.formData) {
                        if (this.formData.hasOwnProperty(key)) {
                            this.formData[key] = ''

                        }
                    }
                    // 提示框
                    this.$message.success(msg)
                    this.loadTableData()
                }

            },
            // 添加用户  -- 显示对话框
            showDiaAddUser() {
                this.dialogFormVisibleAdduser = true
            },
            // 删除用户--弹出提示框
            showDelefirm(user) {
                this.$confirm('sure?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    // 发送删除请求   users/:id
                    const res = await this.$http.delete(`users/${user.id}`)
                    console.log(res)
                    const { meta: { msg, status } } = res.data
                    if (status === 200) {
                        this.pagenum = 1
                        this.loadTableData()
                        this.$message.success(msg)
                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 修改用户状态
            async changeMgState(user) {
                // users/:uId/state/:type
                const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
                console.log(res)
                const { meta: { msg, status } } = res.data
                if (status === 200) {
                    // 提示框
                    this.$message.success(msg)
                }
            },
            // 搜索用户
            async searchUser() {
                this.loadTableData()
            },

            // 分页方法 
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`)
                this.pagesize = val
                this.loadTableData()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`)
                this.pagenum = val
                this.loadTableData()

            },
            async loadTableData() {
                this.loading = true
                // 除登录以外，所有的都需要授权，即设置Authorization为token值
                const AUTH_TOKEN = sessionStorage.getItem('token')
                this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
                const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
                // console.log(res)
                const { meta, data } = res.data
                if (meta.status === 200) {
                    this.total = res.data.data.total
                    this.list = data.users
                    this.loading = false

                }
            }
        },
        data() {
            return {
                list: [],
                //加载动画 
                loading: false,
                // 分页相关数据
                pagesize: 4,
                currentPage: 1,
                pagenum: 1,
                total: 1,
                // 搜索数据
                searchVal: '',
                // 添加用户对话框
                dialogFormVisibleAdduser: false,
                // 添加用户列表
                formData: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                formLabelWidth: '140px',
                // 编辑用户
                dialogFormVisibleEdituser: false,
                currUserId: -1
            }
        }
    }
</script>
<style>
</style>