import PropTypes from 'ant-design-vue/es/_util/vue-types'

import 'ant-design-vue/es/menu/style'
import Menu from 'ant-design-vue/es/menu'
import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'

const { Item: MenuItem, SubMenu } = Menu

export const RouteMenuProps = {
    menus: PropTypes.array,
    theme: PropTypes.string.def('dark'),
    mode: PropTypes.string.def('inline'),
    collapsed: PropTypes.bool.def(false),
    i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false),
}

const renderMenu = (h, item, i18nRender) => {
    if (item && !item.hidden) {
        const bool = item.children && !item.hideChildrenInMenu
        return bool ? renderSubMenu(h, item, i18nRender) : renderMenuItem(h, item, i18nRender)
    }
    return null
}

const renderSubMenu = (h, item, i18nRender) => {
    return (
        <SubMenu
            key={item.path}
            title={
                <span>
                    {renderIcon(h, item.meta.icon)}
                    <span>{renderTitle(h, item.meta.title, i18nRender)}</span>
                </span>
            }
        >
            {!item.hideChildrenInMenu && item.children.map(cd => renderMenu(h, cd, i18nRender))}
        </SubMenu>
    )
}

const renderMenuItem = (h, item, i18nRender) => {
    const meta = Object.assign({}, item.meta)
    const target = meta.target || null
    const CustomTag = (target && 'a') || 'router-link'
    const props = { to: { name: item.name } }
    const attrs = { href: item.path, target: target }
    if (item.children && item.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        item.children.forEach(cd => {
            cd.meta = Object.assign(cd.meta || {}, { hidden: true })
        })
    }
    return (
        <MenuItem key={item.path}>
            <CustomTag {...{ props, attrs }}>
                {renderIcon(h, meta.icon)}
                {renderTitle(h, meta.title, i18nRender)}
                {renderAuthIcon(h, meta.authorized)}
            </CustomTag>
        </MenuItem>
    )
}

const renderAuthIcon = (h, authorized) => {
    if (authorized === true) {
        return null
    }
    if (authorized === false) {
        const props = {}
        props.type = 'lock'
        const style = {
            width: '20px',
            height: '20px',
            marginLeft: '10px',
            lineHeight: '24px',
            fontSize: '12px',
            color: '#FF525A',
            borderRadius: '10px',
            background: 'rgba(255,82,90,0.19)',
        }
        return (
            <span>
                <Icon {...{ props }} style={style} />
            </span>
        )
    }
}

const renderIcon = (h, icon) => {
    if (icon === undefined || icon === 'none' || icon === null) {
        return null
    }
    const props = {}
    typeof icon === 'object' ? (props.component = icon) : (props.type = icon)
    return <Icon {...{ props }} />
}

const renderTitle = (h, title, i18nRender) => {
    return <span>{(i18nRender && i18nRender(title)) || title}</span>
}

const RouteMenu = {
    name: 'RouteMenu',
    props: RouteMenuProps,
    data() {
        return {
            openKeys: [],
            selectedKeys: [],
            cachedOpenKeys: [],
            initFlag: false,
        }
    },
    render(h) {
        const { mode, theme, menus, i18nRender } = this
        const handleOpenChange = openKeys => {
            this.openKeys = openKeys
        }

        const dynamicProps = {
            props: {
                mode,
                theme,
                openKeys: this.openKeys,
                selectedKeys: this.selectedKeys,
            },
            on: {
                select: menu => {
                    this.selectedKeys = menu.selectedKeys
                    this.$emit('select', menu)
                },
                openChange: handleOpenChange,
            },
        }

        const menuItems = menus.map(item => {
            if (item.hidden) {
                return null
            }
            return renderMenu(h, item, i18nRender)
        })
        return <Menu {...dynamicProps}>{menuItems}</Menu>
    },
    methods: {
        updateMenu() {
            const routes = this.$route.matched.concat()
            const { hidden } = this.$route.meta
            if (routes.length >= 3 && hidden) {
                routes.pop()
                this.selectedKeys = [routes[routes.length - 1].path]
            } else {
                this.selectedKeys = [routes.pop().path]
            }
            const openKeys = []
            if (this.mode === 'inline' && this.initFlag) {
                this.menus.forEach(item => {
                    item.path && openKeys.push(item.path)
                })
            }
            this.openKeys = openKeys.length ? openKeys : this.openKeys
            this.initFlag = false
        },
    },
    computed: {
        rootSubmenuKeys: vm => {
            const keys = []
            vm.menus.forEach(item => keys.push(item.path))
            return keys
        },
    },
    created() {
        this.$watch('$route', () => {
            this.updateMenu()
        })
        this.$watch('collapsed', val => {
            if (val) {
                this.cachedOpenKeys = this.openKeys.concat()
                this.openKeys = []
            } else {
                this.openKeys = this.cachedOpenKeys
            }
        })
    },
    mounted() {
        this.initFlag = true
        this.updateMenu()
    },
}

export default RouteMenu
