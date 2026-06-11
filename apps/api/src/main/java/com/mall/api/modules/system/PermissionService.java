package com.mall.api.modules.system;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mall.api.modules.auth.dto.MenuItem;
import com.mall.api.modules.auth.dto.PermissionsResponse;
import com.mall.api.modules.system.entity.*;
import com.mall.api.modules.system.mapper.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PermissionService {

    private final SysRoleMapper sysRoleMapper;
    private final SysMenuMapper sysMenuMapper;
    private final SysRoleMenuMapper sysRoleMenuMapper;

    public PermissionService(SysRoleMapper sysRoleMapper, SysMenuMapper sysMenuMapper,
                             SysRoleMenuMapper sysRoleMenuMapper) {
        this.sysRoleMapper = sysRoleMapper;
        this.sysMenuMapper = sysMenuMapper;
        this.sysRoleMenuMapper = sysRoleMenuMapper;
    }

    public PermissionsResponse getPermissionsByRole(String role) {
        PermissionsResponse response = new PermissionsResponse();

        SysRole sysRole = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, role));
        if (sysRole == null) {
            response.setMenus(Collections.emptyList());
            response.setButtonPermissions(Collections.emptyList());
            return response;
        }

        List<SysRoleMenu> roleMenus = sysRoleMenuMapper.selectList(
                new LambdaQueryWrapper<SysRoleMenu>().eq(SysRoleMenu::getRoleId, sysRole.getId()));
        Set<Long> roleMenuIds = roleMenus.stream()
                .map(SysRoleMenu::getMenuId)
                .collect(Collectors.toSet());

        String appType;
        if ("SUPER_ADMIN".equals(role) || "ADMIN".equals(role)) {
            appType = "ADMIN";
        } else {
            appType = "MERCHANT";
        }

        List<SysMenu> allMenus = sysMenuMapper.selectList(
                new LambdaQueryWrapper<SysMenu>()
                        .eq(SysMenu::getAppType, appType)
                        .eq(SysMenu::getDeleted, false)
                        .eq(SysMenu::getStatus, "ENABLE"));

        List<String> buttonPermissions = allMenus.stream()
                .filter(m -> "BUTTON".equals(m.getType()) && roleMenuIds.contains(m.getId()))
                .map(SysMenu::getPermission)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
        response.setButtonPermissions(buttonPermissions);

        List<SysMenu> visibleMenus = allMenus.stream()
                .filter(m -> ("DIRECTORY".equals(m.getType()) || "MENU".equals(m.getType())))
                .filter(m -> m.getVisible() == null || m.getVisible())
                .filter(m -> roleMenuIds.contains(m.getId()))
                .sorted(Comparator.comparing(SysMenu::getSort, Comparator.nullsLast(Integer::compareTo)))
                .collect(Collectors.toList());

        Map<Long, List<MenuItem>> childrenMap = new HashMap<>();
        List<MenuItem> roots = new ArrayList<>();

        for (SysMenu menu : visibleMenus) {
            MenuItem item = toMenuItem(menu);
            item.setChildren(new ArrayList<>());
            childrenMap.computeIfAbsent(menu.getParentId() == null ? 0L : menu.getParentId(), k -> new ArrayList<>()).add(item);
        }

        for (MenuItem item : childrenMap.getOrDefault(0L, Collections.emptyList())) {
            buildTree(item, childrenMap);
            roots.add(item);
        }

        response.setMenus(roots);
        return response;
    }

    private void buildTree(MenuItem parent, Map<Long, List<MenuItem>> childrenMap) {
        List<MenuItem> children = childrenMap.get(parent.getId());
        if (children != null) {
            for (MenuItem child : children) {
                buildTree(child, childrenMap);
            }
            parent.setChildren(children);
        }
    }

    private MenuItem toMenuItem(SysMenu menu) {
        MenuItem item = new MenuItem();
        item.setId(menu.getId());
        item.setType("DIRECTORY".equals(menu.getType()) ? "directory" : "menu");
        item.setPath(menu.getPath());
        item.setTitle(menu.getTitle());
        item.setIcon(menu.getIcon());
        item.setParentId(menu.getParentId());
        item.setOrder(menu.getSort());
        item.setStatus("ENABLE".equals(menu.getStatus()) ? "active" : "inactive");
        item.setPermission(menu.getPermission());
        return item;
    }

    public List<SysMenu> getAdminMenuTree(String appType) {
        List<SysMenu> allMenus = sysMenuMapper.selectList(
                new LambdaQueryWrapper<SysMenu>()
                        .eq(appType != null, SysMenu::getAppType, appType)
                        .eq(SysMenu::getDeleted, false)
                        .orderByAsc(SysMenu::getSort));
        return buildMenuTree(allMenus, 0L);
    }

    private List<SysMenu> buildMenuTree(List<SysMenu> allMenus, Long parentId) {
        List<SysMenu> tree = new ArrayList<>();
        for (SysMenu menu : allMenus) {
            Long menuParentId = menu.getParentId() == null ? 0L : menu.getParentId();
            if (menuParentId.equals(parentId)) {
                List<SysMenu> children = buildMenuTree(allMenus, menu.getId());
                menu.setDeleted(children != null && !children.isEmpty() ? null : null);
                tree.add(menu);
                if (!children.isEmpty()) {
                    tree.addAll(children);
                }
            }
        }
        return tree;
    }

    /**
     * 返回该角色被授权的全部菜单/按钮权限码（sys_role_menu → sys_menu.permission，去重）。
     * 供后端方法级鉴权 @perm.has(...) 使用，确保「未勾选的菜单/权限，接口也不可访问」。
     */
    public Set<String> getGrantedPermissionCodes(String role) {
        if (role == null || role.isBlank()) {
            return Collections.emptySet();
        }
        SysRole sysRole = sysRoleMapper.selectOne(
                new LambdaQueryWrapper<SysRole>().eq(SysRole::getCode, role));
        if (sysRole == null) {
            return Collections.emptySet();
        }
        List<SysRoleMenu> roleMenus = sysRoleMenuMapper.selectList(
                new LambdaQueryWrapper<SysRoleMenu>().eq(SysRoleMenu::getRoleId, sysRole.getId()));
        Set<Long> roleMenuIds = roleMenus.stream()
                .map(SysRoleMenu::getMenuId)
                .collect(Collectors.toSet());
        if (roleMenuIds.isEmpty()) {
            return Collections.emptySet();
        }
        List<SysMenu> menus = sysMenuMapper.selectList(
                new LambdaQueryWrapper<SysMenu>()
                        .in(SysMenu::getId, roleMenuIds)
                        .eq(SysMenu::getDeleted, false)
                        .eq(SysMenu::getStatus, "ENABLE"));
        return menus.stream()
                .map(SysMenu::getPermission)
                .filter(p -> p != null && !p.isBlank())
                .collect(Collectors.toSet());
    }

    public List<Long> getRoleMenus(Long roleId) {
        List<SysRoleMenu> roleMenus = sysRoleMenuMapper.selectList(
                new LambdaQueryWrapper<SysRoleMenu>().eq(SysRoleMenu::getRoleId, roleId));
        return roleMenus.stream().map(SysRoleMenu::getMenuId).collect(Collectors.toList());
    }
}
