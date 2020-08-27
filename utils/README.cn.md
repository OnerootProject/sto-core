# 运行环境依赖
 - node
   >brew install node
 - truffle
   >npm install -g truffle
 - ganache-cli (推荐安装)
   >npm install -g ganache-cli
 - metamask
   浏览器安装 metamask 插件

 - 安装项目依赖
   >npm install

# 启动步骤
  1. 启动以太坊测试虚拟机
     >  $ ./testrpc.sh
  2. 部署合约
     >$ truffle migrate
  3. 启动文档
     >$ ./doc/bin/www
  4. 浏览文档
    浏览器地址栏输入 http://localhost:3000
  5. 导入账户到metamask


 >  ------------------------- Contracts' address(Kovan): ------------------------------
 >  PolicyRegistry:                          0x9a20f92e435701c36d565d22208d0d7e3c6f548f
 >  STGFactory:                              0xadea9313274b96e5924025e1813b0674f5ab195c
 >  DefaultSTOFactory:                       0x7d8a6f17361b9ee7f631c608a43e9d2edaa915dd
 >  SecurityToken:                           0xdfd038b3a52f2c228b3bf04101fc547d883257dd
 >  SecurityTokenPolicy:                     0x4ed592336f7612553f53429b660f961322b07884
 >  defaultSTO:                              0x9aaabd453c64a51a430dff84d83bf53bf56b95b2
 >  ---------------------------------------------------------------------------------

