<template>
    <el-card class="box-card">
        <!-- 面包屑 -->
        <my-bread level1="权限管理" level2="角色列表"></my-bread>
        <!-- 添加按钮 -->

        <el-col :sapn="24" class="addbtn">
            <el-button type="primary">添加角色</el-button>
        </el-col>

        <!-- 表格 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row v-for="(item1,index) in scope.row.children" :key="index" class="level1">
                        <el-col :span="4">
                            <el-tag @close="deleRight(scope.row,item1.id)" type="success" closable>{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(item2,index) in item1.children" :key="index" class="level2">
                                <el-col :span="4">
                                    <el-tag @close="deleRight(scope.row,item2.id)" type="info" closable>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleRight(scope.row,item3.id)" type="warning" closable v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row>
                        <span v-if="scope.row.children.length === 0 ">该角色未分配权限</span>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="#" type="index">
            </el-table-column>
            <el-table-column label="角色名称" prop="roleName">
            </el-table-column>
            <el-table-column label="角色描述" prop="roleDesc">
            </el-table-column>
            <el-table-column label="操作" prop="desc">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" :plain="true" @click="showEditdia(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" :plain="true" @click="showSetRightDia(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" :plain="true" @click="showDelefirm(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 显示权限对话框 -->
        <el-dialog title="分配权限" :visible.sync="dialogVisible" width="35%">
            <template slot-scope="scope">
                <el-tree  ref="tree" :data="treelist" show-checkbox node-key="id" default-expand-all  :default-checked-keys="checkArr"
                    :props="defaultProps">
                </el-tree>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRight()">确 定</el-button>
            </span>
        </el-dialog>
    </el-card>
</template>
<script>
    export default {
        data() {
            return {
                list: [],
                dialogVisible: false,
                // 树形结构所用的数据
                treelist: [],
                expandArr: [],
                checkArr: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                // 当前角色的id 
                currRoleId: -1

            }
        },
        created() {
            this.loadTableData()
        },
        methods: {
            // 分配角色

            async setRight(){

                this.dialogVisible = false
                // 请求路径：roles/:roleId/rights   post 
                // :roleId	角色 ID	不能为空携带在url中
                // rids	权限 ID 列表	以 , 分割的权限 ID 列表
                
                const arr1 = this.$refs.tree.getCheckedKeys()
                // console.log(arr1)
                const arr2 = this.$refs.tree.getHalfCheckedKeys()
                // console.log(arr2)
                const arr = [...arr1,...arr2]
                // console.log(arr)

                const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{
                    rids: arr.join(',')
                })
                console.log(res)
                this.loadTableData()
            },
            // 显示对话框
            async showSetRightDia(role) {
                this.currRoleId = role.id
                // 获取所有权限
                const res = await this.$http.get(`rights/tree`)
                // console.log(res)
                this.treelist = res.data.data
                const arr = res.data.data
                const arrEmpty = []
                arr.forEach(item1 => {
                    arrEmpty.push(item1.id)
                    item1.children.forEach(item2 => {
                        arrEmpty.push(item2.id)
                        item2.children.forEach(item3 => {
                            arrEmpty.push(item3.id)
                        })
                    })
                })
                // 获取所有权限id的数组
                this.expandArr = arrEmpty
                // 获取当前用户的角色role 里面的所有权限的id
                const arrCheck = []
                role.children.forEach(item1 => {
                    // arrCheck.push(item1.id)
                    item1.children.forEach(item2 => {
                        // arrCheck.push(item2.id)
                        item2.children.forEach(item3 => {
                            arrCheck.push(item3.id)

                        })

                    })
                })
                // console.log(arrCheck)
                this.checkArr =arrCheck
                this.dialogVisible = true
                
            },
            // 取消角色权限
            // roles/:roleId/rights/:rightId
            // :roleId	角色 ID	不能为空携带在url中
            // :rightId	权限 ID	不能为空携带在url中

            async deleRight(role, rightId) {
                const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                // console.log(res)
                const { meta: { status, msg } } = res.data
                if (status === 200) {
                    this.$message.success(msg)
                    // this.loadTableData()

                    // 局部更新视图 刷新当前数据 ==> 给当前的children从新赋值
                    role.children = res.data.data
                }
            },
            async loadTableData() {
                const res = await this.$http.get(`roles`)
                // console.log(res)
                this.list = res.data.data
            }
        }
    }
</script>
<style>
    .box-card {
        height: 100%;
    }

    .addbtn {
        margin-top: 20px;
    }

    .level1 {
        margin-bottom: 20px;
        ;
    }

    .level2 {
        margin-bottom: 20px;
        ;
    }
</style>